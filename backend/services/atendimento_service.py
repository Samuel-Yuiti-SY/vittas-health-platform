from datetime import datetime, timezone

from database import AVISO_MVP, atendimentos, pacientes, profissionais, triagens, unidades
from services.fila_service import atualizar_status, buscar_atendimento, recalcular_filas


def buscar_paciente(paciente_id: int) -> dict | None:
    return next((paciente for paciente in pacientes if paciente["id"] == paciente_id), None)


def buscar_unidade(unidade_id: int) -> dict | None:
    return next((unidade for unidade in unidades if unidade["id"] == unidade_id), None)


def buscar_profissional(profissional_id: int | None) -> dict | None:
    if profissional_id is None:
        return profissionais[0] if profissionais else None
    return next((profissional for profissional in profissionais if profissional["id"] == profissional_id), None)


def buscar_triagem(triagem_id: int) -> dict | None:
    return next((triagem for triagem in triagens if triagem["id"] == triagem_id), None)


def listar_atendimentos(status: str | None = None) -> list[dict]:
    recalcular_filas()
    if status:
        return [atendimento for atendimento in atendimentos if atendimento["status"] == status]
    return atendimentos


def gerar_atestado(atendimento: dict, dados: dict) -> dict:
    paciente = buscar_paciente(atendimento["pacienteId"])
    unidade = buscar_unidade(atendimento["unidadeId"])
    profissional = buscar_profissional(dados.get("profissionalId"))
    return {
        "paciente": paciente["nome"],
        "cpf": paciente["cpf"],
        "dataAtendimento": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "unidade": unidade["nome"],
        "profissional": profissional["nome"] if profissional else "Profissional de saude",
        "cidObservacao": dados.get("cidObservacao"),
        "diasAfastamento": dados.get("diasAtestado") or 1,
        "orientacao": dados["orientacao"],
        "aviso": "Este documento e uma simulacao academica para demonstracao do MVP VITTAS.",
    }


def registrar_resultado(atendimento_id: int, dados: dict) -> dict:
    atendimento = buscar_atendimento(atendimento_id)
    if not atendimento:
        raise ValueError("Atendimento nao encontrado.")

    atendimento["profissionalId"] = dados.get("profissionalId") or atendimento.get("profissionalId")
    atendimento["resultado"] = dados["resultado"]
    atendimento["orientacao"] = dados["orientacao"]
    atendimento["medicacao"] = dados.get("medicacao")
    atendimento["intervaloMedicacao"] = dados.get("intervaloMedicacao")
    atendimento["observacoes"] = dados.get("observacoes")
    atendimento["dataRetorno"] = dados.get("dataRetorno")
    atendimento["horarioRetorno"] = dados.get("horarioRetorno")
    atendimento["passagemEnfermeiro"] = dados.get("passagemEnfermeiro")
    atendimento["previsaoAcompanhamento"] = dados.get("previsaoAcompanhamento")
    if dados.get("gerarAtestadoDigital"):
        atendimento["atestadoDigital"] = gerar_atestado(atendimento, dados)

    if atendimento["status"] in ["Aguardando", "Chamado"]:
        atualizar_status(atendimento_id, "Em atendimento")
    return atendimento


def finalizar_atendimento(atendimento_id: int) -> dict:
    atendimento = buscar_atendimento(atendimento_id)
    if not atendimento:
        raise ValueError("Atendimento nao encontrado.")
    if not atendimento.get("resultado") or not atendimento.get("orientacao"):
        raise ValueError("Registre resultado e orientacao antes de finalizar.")

    atualizar_status(atendimento_id, "Finalizado")
    paciente = buscar_paciente(atendimento["pacienteId"])
    unidade = buscar_unidade(atendimento["unidadeId"])
    triagem = buscar_triagem(atendimento["triagemId"])

    historico = {
        "atendimentoId": atendimento["id"],
        "data": atendimento["dataFinalizacao"],
        "unidade": unidade["nome"],
        "classificacao": triagem["classificacao"] if triagem else "Nao informada",
        "resultado": atendimento.get("resultado"),
        "orientacao": atendimento.get("orientacao"),
        "medicacao": atendimento.get("medicacao"),
        "intervaloMedicacao": atendimento.get("intervaloMedicacao"),
        "observacoes": atendimento.get("observacoes"),
        "dataRetorno": atendimento.get("dataRetorno"),
        "horarioRetorno": atendimento.get("horarioRetorno"),
        "atestadoDigital": atendimento.get("atestadoDigital"),
    }
    if paciente and not any(item["atendimentoId"] == atendimento_id for item in paciente["historicoAtendimentos"]):
        paciente["historicoAtendimentos"].append(historico)
    return atendimento


def aviso_mvp() -> dict:
    return {"aviso": AVISO_MVP}
