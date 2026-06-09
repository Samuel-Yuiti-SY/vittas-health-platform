from typing import List, Optional

from pydantic import BaseModel, Field


class Usuario(BaseModel):
    id: int
    nome: str
    email: str
    senha: str
    perfil: str
    pacienteId: Optional[int] = None
    profissionalId: Optional[int] = None


class UsuarioPublico(BaseModel):
    id: int
    nome: str
    email: str
    perfil: str
    pacienteId: Optional[int] = None
    profissionalId: Optional[int] = None


class LoginRequest(BaseModel):
    email: str
    senha: str


class LoginResponse(BaseModel):
    usuario: UsuarioPublico
    redirecionarPara: str
    mensagem: str


class AtestadoDigital(BaseModel):
    paciente: str
    cpf: str
    dataAtendimento: str
    unidade: str
    profissional: str
    cidObservacao: Optional[str] = None
    diasAfastamento: int
    orientacao: str
    aviso: str


class HistoricoAtendimento(BaseModel):
    atendimentoId: int
    data: str
    unidade: str
    classificacao: str
    resultado: Optional[str] = None
    orientacao: Optional[str] = None
    medicacao: Optional[str] = None
    intervaloMedicacao: Optional[str] = None
    observacoes: Optional[str] = None
    dataRetorno: Optional[str] = None
    horarioRetorno: Optional[str] = None
    atestadoDigital: Optional[AtestadoDigital] = None


class Paciente(BaseModel):
    id: int
    nome: str
    cpf: str
    dataNascimento: str
    idade: int
    telefone: str
    email: str
    bairro: str
    endereco: str
    cartaoSus: str
    historicoMedico: str
    alergias: str
    medicamentosUsoContinuo: str
    contatoEmergencia: str
    ultimoCheckin: Optional[str] = None
    historicoAtendimentos: List[HistoricoAtendimento] = Field(default_factory=list)


class PacienteCreate(BaseModel):
    nome: str
    cpf: str
    dataNascimento: str
    telefone: str
    email: str
    senha: str
    bairro: str
    endereco: str
    cartaoSus: str
    historicoMedico: str
    alergias: str
    medicamentosUsoContinuo: str
    contatoEmergencia: str


class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    dataNascimento: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    bairro: Optional[str] = None
    endereco: Optional[str] = None
    cartaoSus: Optional[str] = None
    historicoMedico: Optional[str] = None
    alergias: Optional[str] = None
    medicamentosUsoContinuo: Optional[str] = None
    contatoEmergencia: Optional[str] = None


class UnidadeSaude(BaseModel):
    id: int
    nome: str
    tipo: str
    bairro: str
    endereco: str
    tempoMedio: int
    especialidades: List[str]
    fila: List[int] = Field(default_factory=list)


class TriagemCreate(BaseModel):
    pacienteId: int
    sintomas: List[str]
    inicioSintomas: str
    verificouFebre: bool = False
    faltaArIntensa: bool = False
    desmaio: bool = False
    convulsao: bool = False
    sangramentoIntenso: bool = False
    acidenteGrave: bool = False
    suspeitaAvc: bool = False
    gestante: bool = False
    crianca: bool = False
    idoso: bool = False
    condicaoPrioritaria: bool = False
    especialidadeDesejada: Optional[str] = None


class Triagem(BaseModel):
    id: int
    triagemId: Optional[int] = None
    pacienteId: int
    sintomas: List[str]
    inicioSintomas: str
    verificouFebre: bool
    faltaArIntensa: bool
    desmaio: bool
    convulsao: bool
    sangramentoIntenso: bool
    acidenteGrave: bool
    suspeitaAvc: bool
    gestante: bool
    crianca: bool
    idoso: bool
    condicaoPrioritaria: bool = False
    especialidadeDesejada: Optional[str] = None
    classificacao: str
    scorePrioridade: int
    unidadeRecomendadaId: int
    unidadeRecomendada: Optional[dict] = None
    especialidadeRecomendada: str
    tempoEstimado: Optional[int] = None
    mensagem: Optional[str] = None
    emergencia: bool = False
    alertaDorPeito: bool = False
    alertaEmergencia: bool
    mensagemAlerta: Optional[str] = None
    dataHora: str


class FilaEntrada(BaseModel):
    pacienteId: int
    triagemId: int
    unidadeId: Optional[int] = None


class FilaChamarProximo(BaseModel):
    unidadeId: Optional[int] = None


class StatusUpdate(BaseModel):
    status: str


class Atendimento(BaseModel):
    id: int
    atendimentoId: Optional[int] = None
    pacienteId: int
    unidadeId: int
    triagemId: int
    status: str
    posicaoFila: Optional[int] = None
    tempoEstimado: Optional[int] = None
    dataCheckin: str
    dataInicio: Optional[str] = None
    dataFinalizacao: Optional[str] = None
    profissionalId: Optional[int] = None
    resultado: Optional[str] = None
    orientacao: Optional[str] = None
    medicacao: Optional[str] = None
    intervaloMedicacao: Optional[str] = None
    observacoes: Optional[str] = None
    dataRetorno: Optional[str] = None
    horarioRetorno: Optional[str] = None
    passagemEnfermeiro: Optional[str] = None
    previsaoAcompanhamento: Optional[str] = None
    scorePrioridade: int
    atestadoDigital: Optional[AtestadoDigital] = None


class AtendimentoResultado(BaseModel):
    profissionalId: Optional[int] = None
    resultado: str
    orientacao: str
    medicacao: Optional[str] = None
    intervaloMedicacao: Optional[str] = None
    observacoes: Optional[str] = None
    dataRetorno: Optional[str] = None
    horarioRetorno: Optional[str] = None
    passagemEnfermeiro: Optional[str] = None
    previsaoAcompanhamento: Optional[str] = None
    gerarAtestadoDigital: bool = False
    diasAtestado: Optional[int] = None
    cidObservacao: Optional[str] = None


class Dashboard(BaseModel):
    totalPacientesAguardando: int
    totalAtendimentosConcluidosHoje: int
    tempoMedioEspera: float
    unidadeMaiorDemanda: str
    pacientesPorPrioridade: dict
    atendimentosPorTipo: dict
    numeroCasosPrioritarios: int
    numeroCasosEmergencia: int
    pacientesPorUnidade: dict
    pacientesEncaminhados: int
    pacientesFinalizados: int
    atendimentosPorStatus: dict
    atendimentosRecentes: list


class ProfissionalSaude(BaseModel):
    id: int
    nome: str
    registro: str
    especialidade: str
    unidadeId: int
