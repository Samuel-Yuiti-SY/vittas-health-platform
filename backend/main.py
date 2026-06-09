import os
from typing import Optional

from fastapi import Body, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from database import BAIRROS, ESPECIALIDADES, AVISO_MVP, pacientes, profissionais, triagens, unidades
from models import (
    Atendimento,
    AtendimentoResultado,
    Dashboard,
    FilaChamarProximo,
    FilaEntrada,
    LoginRequest,
    LoginResponse,
    Paciente,
    PacienteCreate,
    PacienteUpdate,
    ProfissionalSaude,
    StatusUpdate,
    Triagem,
    TriagemCreate,
    UnidadeSaude,
    UsuarioPublico,
)
from services import atendimento_service, auth_service, dashboard_service, fila_service, paciente_service
from services.triagem_service import buscar_triagem, criar_triagem, metadados_triagem


app = FastAPI(
    title="VITTAS MVP API",
    description="Back-end FastAPI com dados simulados para o MVP academico VITTAS.",
    version="1.0.0",
)

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if allowed_origins_env:
    allowed_origins.extend(
        origin.strip()
        for origin in allowed_origins_env.split(",")
        if origin.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def erro_404(mensagem: str) -> None:
    raise HTTPException(status_code=404, detail=mensagem)


def erro_400(mensagem: str) -> None:
    raise HTTPException(status_code=400, detail=mensagem)


@app.get("/")
def raiz() -> dict:
    return {
        "nome": "VITTAS",
        "status": "online",
        "aviso": AVISO_MVP,
    }


@app.get("/health")
def health_check() -> dict:
    return {
        "status": "ok",
        "project": "VITTAS MVP",
    }


@app.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> dict:
    resposta = auth_service.autenticar(payload.email, payload.senha)
    if not resposta:
        raise HTTPException(status_code=401, detail="E-mail ou senha invalidos.")
    return resposta


@app.get("/usuarios", response_model=list[UsuarioPublico])
def listar_usuarios() -> list[dict]:
    return auth_service.listar_usuarios_publicos()


@app.get("/pacientes", response_model=list[Paciente])
def listar_pacientes() -> list[dict]:
    return pacientes


@app.get("/pacientes/{paciente_id}", response_model=Paciente)
def obter_paciente(paciente_id: int) -> dict:
    paciente = paciente_service.buscar_paciente(paciente_id)
    if not paciente:
        erro_404("Paciente nao encontrado.")
    return paciente


@app.post("/pacientes", response_model=Paciente, status_code=201)
def criar_paciente_endpoint(payload: PacienteCreate) -> dict:
    try:
        return paciente_service.criar_paciente(payload.model_dump())
    except ValueError as exc:
        erro_400(str(exc))


@app.put("/pacientes/{paciente_id}", response_model=Paciente)
def atualizar_paciente_endpoint(paciente_id: int, payload: PacienteUpdate) -> dict:
    try:
        return paciente_service.atualizar_paciente(paciente_id, payload.model_dump(exclude_unset=True))
    except ValueError as exc:
        erro_400(str(exc))


@app.get("/pacientes/{paciente_id}/historico")
def historico_paciente(paciente_id: int) -> list[dict]:
    paciente = paciente_service.buscar_paciente(paciente_id)
    if not paciente:
        erro_404("Paciente nao encontrado.")
    return paciente["historicoAtendimentos"]


@app.get("/unidades", response_model=list[UnidadeSaude])
def listar_unidades(
    bairro: Optional[str] = Query(default=None),
    tipo: Optional[str] = Query(default=None),
) -> list[dict]:
    resultado = unidades
    if bairro:
        resultado = [unidade for unidade in resultado if unidade["bairro"].lower() == bairro.lower()]
    if tipo:
        resultado = [unidade for unidade in resultado if unidade["tipo"].lower() == tipo.lower()]
    return resultado


@app.get("/unidades/{unidade_id}", response_model=UnidadeSaude)
def obter_unidade(unidade_id: int) -> dict:
    unidade = fila_service.buscar_unidade(unidade_id)
    if not unidade:
        erro_404("Unidade nao encontrada.")
    return unidade


@app.get("/bairros")
def listar_bairros() -> list[str]:
    return BAIRROS


@app.get("/especialidades")
def listar_especialidades() -> list[str]:
    return ESPECIALIDADES


@app.get("/triagem/metadados")
def obter_metadados_triagem() -> dict:
    return metadados_triagem()


@app.post("/triagem", response_model=Triagem, status_code=201)
def criar_triagem_endpoint(payload: TriagemCreate) -> dict:
    try:
        return criar_triagem(payload.model_dump())
    except ValueError as exc:
        erro_400(str(exc))


@app.get("/triagem/{triagem_id}", response_model=Triagem)
def obter_triagem(triagem_id: int) -> dict:
    triagem = buscar_triagem(triagem_id)
    if not triagem:
        erro_404("Triagem nao encontrada.")
    return triagem


@app.get("/fila", response_model=list[Atendimento])
def listar_fila(unidade_id: Optional[int] = Query(default=None)) -> list[dict]:
    return fila_service.listar_fila(unidade_id)


@app.get("/fila/paciente/{paciente_id}", response_model=Optional[Atendimento])
def fila_do_paciente(paciente_id: int) -> dict | None:
    if not paciente_service.buscar_paciente(paciente_id):
        erro_404("Paciente nao encontrado.")
    return fila_service.paciente_fila(paciente_id)


@app.get("/fila/{unidade_id}", response_model=list[Atendimento])
def listar_fila_unidade(unidade_id: int) -> list[dict]:
    if not fila_service.buscar_unidade(unidade_id):
        erro_404("Unidade nao encontrada.")
    return fila_service.listar_fila(unidade_id)


@app.post("/fila/entrar", response_model=Atendimento, status_code=201)
def entrar_fila(payload: FilaEntrada) -> dict:
    try:
        return fila_service.entrar_na_fila(payload.pacienteId, payload.triagemId, payload.unidadeId)
    except ValueError as exc:
        erro_400(str(exc))


@app.post("/fila/chamar-proximo", response_model=Atendimento)
def chamar_proximo(payload: FilaChamarProximo | None = Body(default=None)) -> dict:
    unidade_id = payload.unidadeId if payload else None
    atendimento = fila_service.chamar_proximo(unidade_id)
    if not atendimento:
        erro_404("Nao ha pacientes aguardando para chamar.")
    return atendimento


@app.put("/fila/{atendimento_id}/status", response_model=Atendimento)
def atualizar_status_fila(atendimento_id: int, payload: StatusUpdate) -> dict:
    try:
        return fila_service.atualizar_status(atendimento_id, payload.status)
    except ValueError as exc:
        erro_400(str(exc))


@app.get("/atendimentos", response_model=list[Atendimento])
def listar_atendimentos(status: Optional[str] = Query(default=None)) -> list[dict]:
    return atendimento_service.listar_atendimentos(status)


@app.get("/atendimentos/{atendimento_id}", response_model=Atendimento)
def obter_atendimento(atendimento_id: int) -> dict:
    atendimento = fila_service.buscar_atendimento(atendimento_id)
    if not atendimento:
        erro_404("Atendimento nao encontrado.")
    return atendimento


@app.post("/atendimentos/{atendimento_id}/resultado", response_model=Atendimento)
def registrar_resultado(atendimento_id: int, payload: AtendimentoResultado) -> dict:
    try:
        return atendimento_service.registrar_resultado(atendimento_id, payload.model_dump())
    except ValueError as exc:
        erro_400(str(exc))


@app.put("/atendimentos/{atendimento_id}/finalizar", response_model=Atendimento)
def finalizar_atendimento(atendimento_id: int) -> dict:
    try:
        return atendimento_service.finalizar_atendimento(atendimento_id)
    except ValueError as exc:
        erro_400(str(exc))


@app.get("/profissionais", response_model=list[ProfissionalSaude])
def listar_profissionais() -> list[dict]:
    return profissionais


@app.get("/profissionais/pacientes-encaminhados", response_model=list[Atendimento])
def pacientes_encaminhados() -> list[dict]:
    return atendimento_service.listar_atendimentos("Encaminhado")


@app.get("/dashboard", response_model=Dashboard)
def dashboard() -> dict:
    return dashboard_service.obter_dashboard()
