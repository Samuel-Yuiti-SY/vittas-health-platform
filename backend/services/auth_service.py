from database import usuarios


ROTAS_POR_PERFIL = {
    "paciente": "/pre-triagem",
    "funcionario": "/painel-funcionario",
    "admin": "/dashboard",
    "profissional": "/painel-profissional",
}


def remover_senha(usuario: dict) -> dict:
    usuario_publico = usuario.copy()
    usuario_publico.pop("senha", None)
    return usuario_publico


def autenticar(email: str, senha: str) -> dict | None:
    for usuario in usuarios:
        if usuario["email"].lower() == email.lower() and usuario["senha"] == senha:
            return {
                "usuario": remover_senha(usuario),
                "redirecionarPara": ROTAS_POR_PERFIL[usuario["perfil"]],
                "mensagem": "Login realizado com sucesso.",
            }
    return None


def listar_usuarios_publicos() -> list[dict]:
    return [remover_senha(usuario) for usuario in usuarios]
