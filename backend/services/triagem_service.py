import re
from datetime import datetime, timezone

from database import pacientes, proximo_id, triagens, unidades


PERGUNTAS_TRIAGEM = [
    (
        "Ola, eu sou o Vitti. Vou te ajudar com uma pre-triagem inicial. "
        "Responda algumas perguntas para que eu possa orientar o melhor fluxo de atendimento."
    ),
    "Quais sintomas voce esta sentindo?",
    "Desde quando esta com esses sintomas?",
    "Verificou se houve febre?",
    "Voce esta com falta de ar intensa?",
    "Voce teve desmaio?",
    "Voce teve convulsao?",
    "Voce esta com sangramento intenso?",
    "Voce sofreu algum acidente grave?",
    "Existe suspeita de AVC?",
    "Voce e gestante?",
    "Voce e crianca, idoso ou possui alguma prioridade?",
    "Voce deseja atendimento para alguma especialidade?",
]

OPCOES_SINTOMAS = [
    "Febre",
    "Dor de cabeca",
    "Tosse",
    "Dor abdominal",
    "Nausea ou vomito",
    "Falta de ar",
    "Sangramento",
    "Desmaio",
    "Convulsao",
    "Suspeita de AVC",
    "Acidente",
    "Dor no peito",
    "Consulta de rotina",
    "Retorno",
    "Vacinacao",
]

MENSAGEM_DOR_PEITO = (
    "A dor no peito pode ter varias causas e deve ser avaliada por um profissional "
    "de saude. Se estiver associada a falta de ar intensa, desmaio, suor frio ou "
    "piora rapida, procure atendimento imediato."
)


def buscar_paciente(paciente_id: int) -> dict | None:
    return next((paciente for paciente in pacientes if paciente["id"] == paciente_id), None)


def buscar_triagem(triagem_id: int) -> dict | None:
    return next((triagem for triagem in triagens if triagem["id"] == triagem_id), None)


def normalizar(texto: str | None) -> str:
    return (texto or "").strip().lower()


def sintomas_normalizados(dados: dict) -> list[str]:
    return [normalizar(sintoma) for sintoma in dados.get("sintomas", [])]


def inicio_indica_muitos_dias(inicio_sintomas: str) -> bool:
    texto = normalizar(inicio_sintomas)
    if any(marcador in texto for marcador in ["muitos", "semana", "varios"]):
        return True
    numeros = [int(numero) for numero in re.findall(r"\d+", texto)]
    return any(numero >= 3 for numero in numeros)


def classificar_triagem(paciente: dict, dados: dict) -> str:
    sintomas = sintomas_normalizados(dados)
    tem_rotina = any(s in sintomas for s in ["consulta de rotina", "retorno", "vacinacao"])
    tem_dor_forte = any("dor forte" in s for s in sintomas)
    emergencia = any(
        [
            dados.get("faltaArIntensa"),
            dados.get("desmaio"),
            dados.get("convulsao"),
            dados.get("sangramentoIntenso"),
            dados.get("acidenteGrave"),
            dados.get("suspeitaAvc"),
            "desmaio" in sintomas,
            "convulsao" in sintomas,
            "suspeita de avc" in sintomas,
            "acidente" in sintomas,
            dados.get("gestante") and (tem_dor_forte or "sangramento" in sintomas),
        ]
    )
    if emergencia:
        return "Emergencia"

    alta = any(
        [
            paciente["idade"] >= 60,
            dados.get("idoso"),
            dados.get("gestante"),
            dados.get("crianca"),
            dados.get("condicaoPrioritaria"),
            dados.get("verificouFebre") and inicio_indica_muitos_dias(dados.get("inicioSintomas", "")),
            tem_dor_forte,
            "falta de ar" in sintomas,
        ]
    )
    if alta:
        return "Alta prioridade"

    baixa = tem_rotina and not dados.get("verificouFebre") and len(sintomas) <= 2
    if baixa:
        return "Baixa prioridade"

    return "Media prioridade"


def calcular_score_prioridade(paciente: dict, triagem: dict) -> int:
    score = 0
    classificacao = triagem["classificacao"]
    if classificacao == "Emergencia":
        score += 100
    if classificacao == "Alta prioridade":
        score += 70
    if classificacao == "Media prioridade":
        score += 40
    if classificacao == "Baixa prioridade":
        score += 10

    if paciente["idade"] >= 60:
        score += 20
    if triagem.get("gestante"):
        score += 20
    if triagem.get("crianca"):
        score += 15
    if triagem.get("condicaoPrioritaria"):
        score += 15

    sintomas_graves = [
        "faltaArIntensa",
        "desmaio",
        "convulsao",
        "sangramentoIntenso",
        "acidenteGrave",
        "suspeitaAvc",
    ]
    if any(triagem.get(campo) for campo in sintomas_graves):
        score += 30
    if inicio_indica_muitos_dias(triagem.get("inicioSintomas", "")):
        score += 10

    return score


def unidade_suporta_especialidade(unidade: dict, especialidade: str | None) -> bool:
    if not especialidade:
        return True
    return especialidade in unidade["especialidades"]


def ordenar_unidades_candidatas(candidatas: list[dict], bairro: str) -> list[dict]:
    return sorted(
        candidatas,
        key=lambda unidade: (
            unidade["bairro"] != bairro,
            unidade["tempoMedio"],
            unidade["id"],
        ),
    )


def recomendar_unidade(paciente: dict, classificacao: str, especialidade: str | None) -> dict:
    bairro = paciente["bairro"]
    if classificacao == "Emergencia":
        tipos_preferidos = ["Hospital", "UPA"]
        especialidade = "Emergencia"
    elif classificacao == "Alta prioridade":
        tipos_preferidos = ["UPA", "Hospital"]
    elif classificacao == "Media prioridade":
        tipos_preferidos = ["UBS", "UPA"]
    else:
        tipos_preferidos = ["UBS"]

    for tipo in tipos_preferidos:
        candidatas = [
            unidade
            for unidade in unidades
            if unidade["tipo"] == tipo and unidade_suporta_especialidade(unidade, especialidade)
        ]
        if candidatas:
            return ordenar_unidades_candidatas(candidatas, bairro)[0]

    candidatas = [unidade for unidade in unidades if unidade_suporta_especialidade(unidade, especialidade)]
    return ordenar_unidades_candidatas(candidatas or unidades, bairro)[0]


def criar_triagem(dados: dict) -> dict:
    paciente = buscar_paciente(dados["pacienteId"])
    if not paciente:
        raise ValueError("Paciente nao encontrado.")

    classificacao = classificar_triagem(paciente, dados)
    especialidade = dados.get("especialidadeDesejada") or "Clinico Geral"
    unidade = recomendar_unidade(paciente, classificacao, especialidade)
    alerta_emergencia = classificacao == "Emergencia"
    mensagem_alerta = None

    if alerta_emergencia:
        mensagem_alerta = "Em sinais graves, ligue 192 ou procure atendimento imediato."
    elif "dor no peito" in sintomas_normalizados(dados):
        mensagem_alerta = MENSAGEM_DOR_PEITO

    tempo_estimado = 10 if classificacao in ["Emergencia", "Alta prioridade"] else unidade["tempoMedio"]
    triagem = {
        **dados,
        "id": proximo_id(triagens),
        "triagemId": 0,
        "classificacao": classificacao,
        "scorePrioridade": 0,
        "unidadeRecomendadaId": unidade["id"],
        "unidadeRecomendada": {
            "id": unidade["id"],
            "nome": unidade["nome"],
            "tipo": unidade["tipo"],
            "bairro": unidade["bairro"],
            "endereco": unidade["endereco"],
        },
        "especialidadeRecomendada": especialidade,
        "tempoEstimado": tempo_estimado,
        "mensagem": f"Recomendamos atendimento na {unidade['nome']}.",
        "emergencia": alerta_emergencia,
        "alertaDorPeito": "dor no peito" in sintomas_normalizados(dados) and not alerta_emergencia,
        "alertaEmergencia": alerta_emergencia,
        "mensagemAlerta": mensagem_alerta,
        "dataHora": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
    }
    triagem["triagemId"] = triagem["id"]
    triagem["scorePrioridade"] = calcular_score_prioridade(paciente, triagem)
    triagens.append(triagem)
    return triagem


def metadados_triagem() -> dict:
    return {
        "perguntas": PERGUNTAS_TRIAGEM,
        "opcoesSintomas": OPCOES_SINTOMAS,
        "mensagemDorPeito": MENSAGEM_DOR_PEITO,
    }
