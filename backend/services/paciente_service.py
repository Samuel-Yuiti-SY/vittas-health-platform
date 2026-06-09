from datetime import date

from database import pacientes, proximo_id, usuarios


def calcular_idade(data_nascimento: str) -> int:
    nascimento = date.fromisoformat(data_nascimento)
    hoje = date.today()
    idade = hoje.year - nascimento.year
    if (hoje.month, hoje.day) < (nascimento.month, nascimento.day):
        idade -= 1
    return idade


def buscar_paciente(paciente_id: int) -> dict | None:
    return next((paciente for paciente in pacientes if paciente["id"] == paciente_id), None)


def criar_paciente(dados: dict) -> dict:
    campos_obrigatorios = [
        "nome",
        "cpf",
        "dataNascimento",
        "telefone",
        "email",
        "senha",
        "bairro",
        "endereco",
        "cartaoSus",
    ]
    faltando = [campo for campo in campos_obrigatorios if not dados.get(campo)]
    if faltando:
        raise ValueError(f"Campos obrigatorios ausentes: {', '.join(faltando)}")

    if any(paciente["email"].lower() == dados["email"].lower() for paciente in pacientes):
        raise ValueError("Ja existe paciente com este e-mail.")

    novo_id = proximo_id(pacientes)
    senha = dados.pop("senha")
    paciente = {
        **dados,
        "id": novo_id,
        "idade": calcular_idade(dados["dataNascimento"]),
        "ultimoCheckin": None,
        "historicoAtendimentos": [],
    }
    pacientes.append(paciente)
    usuarios.append(
        {
            "id": proximo_id(usuarios),
            "nome": paciente["nome"],
            "email": paciente["email"],
            "senha": senha,
            "perfil": "paciente",
            "pacienteId": paciente["id"],
        }
    )
    return paciente


def atualizar_paciente(paciente_id: int, dados: dict) -> dict:
    paciente = buscar_paciente(paciente_id)
    if not paciente:
        raise ValueError("Paciente nao encontrado.")
    for campo, valor in dados.items():
        if valor is not None and campo in paciente:
            paciente[campo] = valor
    if dados.get("dataNascimento"):
        paciente["idade"] = calcular_idade(dados["dataNascimento"])
    return paciente
