from collections import Counter
from datetime import date

from database import atendimentos, pacientes, triagens, unidades
from services.fila_service import STATUS_ATIVOS, recalcular_filas


def buscar_unidade(unidade_id: int) -> dict:
    return next(unidade for unidade in unidades if unidade["id"] == unidade_id)


def buscar_triagem(triagem_id: int) -> dict | None:
    return next((triagem for triagem in triagens if triagem["id"] == triagem_id), None)


def obter_dashboard() -> dict:
    recalcular_filas()
    aguardando = [atendimento for atendimento in atendimentos if atendimento["status"] == "Aguardando"]
    ativos = [atendimento for atendimento in atendimentos if atendimento["status"] in STATUS_ATIVOS]
    concluidos_hoje = [
        atendimento
        for atendimento in atendimentos
        if atendimento["status"] == "Finalizado"
        and atendimento.get("dataFinalizacao", "").startswith(date.today().isoformat())
    ]
    tempos = [atendimento["tempoEstimado"] for atendimento in ativos if atendimento.get("tempoEstimado")]
    demanda_por_unidade = Counter(buscar_unidade(a["unidadeId"])["nome"] for a in ativos)
    prioridades = Counter(buscar_triagem(a["triagemId"])["classificacao"] for a in atendimentos if buscar_triagem(a["triagemId"]))
    tipos = Counter(buscar_unidade(a["unidadeId"])["tipo"] for a in atendimentos)
    status = Counter(atendimento["status"] for atendimento in atendimentos)
    recentes = sorted(
        atendimentos,
        key=lambda atendimento: atendimento.get("dataCheckin") or "",
        reverse=True,
    )[:6]

    unidade_maior_demanda = demanda_por_unidade.most_common(1)[0][0] if demanda_por_unidade else "Sem demanda"
    return {
        "totalPacientesAguardando": len(aguardando),
        "totalAtendimentosConcluidosHoje": len(concluidos_hoje),
        "tempoMedioEspera": round(sum(tempos) / len(tempos), 1) if tempos else 0,
        "unidadeMaiorDemanda": unidade_maior_demanda,
        "pacientesPorPrioridade": dict(prioridades),
        "atendimentosPorTipo": dict(tipos),
        "numeroCasosPrioritarios": prioridades.get("Alta prioridade", 0),
        "numeroCasosEmergencia": prioridades.get("Emergencia", 0),
        "pacientesPorUnidade": dict(demanda_por_unidade),
        "pacientesEncaminhados": status.get("Encaminhado", 0),
        "pacientesFinalizados": status.get("Finalizado", 0),
        "atendimentosPorStatus": dict(status),
        "atendimentosRecentes": [
            {
                "id": atendimento["id"],
                "paciente": next(
                    (paciente["nome"] for paciente in pacientes if paciente["id"] == atendimento["pacienteId"]),
                    "Paciente nao encontrado",
                ),
                "status": atendimento["status"],
                "unidade": buscar_unidade(atendimento["unidadeId"])["nome"],
                "dataCheckin": atendimento["dataCheckin"],
            }
            for atendimento in recentes
        ],
    }
