from datetime import datetime, timezone

from database import STATUS_VALIDOS, atendimentos, pacientes, proximo_id, triagens, unidades
from services.triagem_service import buscar_paciente, buscar_triagem


STATUS_ATIVOS = {"Aguardando", "Chamado", "Em atendimento", "Encaminhado"}


def buscar_unidade(unidade_id: int) -> dict | None:
    return next((unidade for unidade in unidades if unidade["id"] == unidade_id), None)


def buscar_atendimento(atendimento_id: int) -> dict | None:
    return next((atendimento for atendimento in atendimentos if atendimento["id"] == atendimento_id), None)


def data_checkin(atendimento: dict) -> datetime:
    return datetime.fromisoformat(atendimento["dataCheckin"])


def prioridade_atendimento(atendimento: dict) -> int:
    triagem = buscar_triagem(atendimento["triagemId"])
    return triagem["scorePrioridade"] if triagem else atendimento.get("scorePrioridade", 0)


def ordenar_por_prioridade(lista: list[dict]) -> list[dict]:
    return sorted(lista, key=lambda item: (-prioridade_atendimento(item), data_checkin(item)))


def tempo_por_posicao(atendimento: dict, posicao: int) -> int:
    unidade = buscar_unidade(atendimento["unidadeId"])
    tempo_base = 10 if prioridade_atendimento(atendimento) >= 70 else unidade["tempoMedio"]
    return posicao * tempo_base


def recalcular_filas() -> None:
    for unidade in unidades:
        ativos = [
            atendimento
            for atendimento in atendimentos
            if atendimento["unidadeId"] == unidade["id"] and atendimento["status"] in STATUS_ATIVOS
        ]
        ordenados = ordenar_por_prioridade(ativos)
        unidade["fila"] = [atendimento["id"] for atendimento in ordenados]
        for posicao, atendimento in enumerate(ordenados, start=1):
            atendimento["posicaoFila"] = posicao
            atendimento["tempoEstimado"] = tempo_por_posicao(atendimento, posicao)


def listar_fila(unidade_id: int | None = None) -> list[dict]:
    recalcular_filas()
    lista = [
        atendimento
        for atendimento in atendimentos
        if atendimento["status"] in STATUS_ATIVOS and (unidade_id is None or atendimento["unidadeId"] == unidade_id)
    ]
    return ordenar_por_prioridade(lista)


def entrar_na_fila(paciente_id: int, triagem_id: int, unidade_id: int | None = None) -> dict:
    paciente = buscar_paciente(paciente_id)
    triagem = buscar_triagem(triagem_id)
    if not paciente:
        raise ValueError("Paciente nao encontrado.")
    if not triagem:
        raise ValueError("Triagem nao encontrada.")
    if triagem["pacienteId"] != paciente_id:
        raise ValueError("Triagem nao pertence ao paciente informado.")

    unidade_escolhida = unidade_id or triagem["unidadeRecomendadaId"]
    if not buscar_unidade(unidade_escolhida):
        raise ValueError("Unidade nao encontrada.")

    ativo_existente = next(
        (
            atendimento
            for atendimento in atendimentos
            if atendimento["pacienteId"] == paciente_id
            and atendimento["triagemId"] == triagem_id
            and atendimento["status"] in STATUS_ATIVOS
        ),
        None,
    )
    if ativo_existente:
        ativo_existente["atendimentoId"] = ativo_existente["id"]
        recalcular_filas()
        return ativo_existente

    data_checkin = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    atendimento = {
        "id": proximo_id(atendimentos),
        "atendimentoId": 0,
        "pacienteId": paciente_id,
        "unidadeId": unidade_escolhida,
        "triagemId": triagem_id,
        "status": "Aguardando",
        "posicaoFila": None,
        "tempoEstimado": None,
        "dataCheckin": data_checkin,
        "dataInicio": None,
        "dataFinalizacao": None,
        "profissionalId": None,
        "resultado": None,
        "orientacao": None,
        "medicacao": None,
        "intervaloMedicacao": None,
        "observacoes": None,
        "dataRetorno": None,
        "horarioRetorno": None,
        "passagemEnfermeiro": None,
        "previsaoAcompanhamento": None,
        "scorePrioridade": triagem["scorePrioridade"],
        "atestadoDigital": None,
    }
    atendimento["atendimentoId"] = atendimento["id"]
    atendimentos.append(atendimento)
    paciente["ultimoCheckin"] = data_checkin
    recalcular_filas()
    return atendimento


def chamar_proximo(unidade_id: int | None = None) -> dict | None:
    candidatos = [
        atendimento
        for atendimento in listar_fila(unidade_id)
        if atendimento["status"] == "Aguardando"
    ]
    if not candidatos:
        return None
    proximo = candidatos[0]
    proximo["status"] = "Chamado"
    recalcular_filas()
    return proximo


def atualizar_status(atendimento_id: int, status: str) -> dict:
    if status not in STATUS_VALIDOS:
        raise ValueError("Status invalido.")
    atendimento = buscar_atendimento(atendimento_id)
    if not atendimento:
        raise ValueError("Atendimento nao encontrado.")

    atendimento["status"] = status
    agora = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    if status == "Em atendimento" and not atendimento["dataInicio"]:
        atendimento["dataInicio"] = agora
    if status in ["Finalizado", "Cancelado"]:
        atendimento["dataFinalizacao"] = agora
        atendimento["posicaoFila"] = None
    recalcular_filas()
    return atendimento


def paciente_fila(paciente_id: int) -> dict | None:
    ativos = [
        atendimento
        for atendimento in listar_fila()
        if atendimento["pacienteId"] == paciente_id and atendimento["status"] in STATUS_ATIVOS
    ]
    return ativos[0] if ativos else None
