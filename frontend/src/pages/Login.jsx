import { useState } from "react";
import {
  Building2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { login as loginApi } from "../api/api.js";
import Button from "../components/Button.jsx";
import InstitutionalHeader from "../components/InstitutionalHeader.jsx";
import PublicFooter from "../components/PublicFooter.jsx";
import { salvarUsuario } from "../utils/auth.js";

const perfisTeste = [
  {
    perfil: "Paciente",
    descricao: "Acompanha pré-triagem, resultado e fila virtual.",
    email: "paciente@vittas.com.br",
    destino: "/pre-triagem",
    icon: UserRound,
  },
  {
    perfil: "Funcionário",
    descricao: "Gerencia recepção, fila e chamada de pacientes.",
    email: "funcionario@vittas.com.br",
    destino: "/painel-funcionario",
    icon: UsersRound,
  },
  {
    perfil: "Admin",
    descricao: "Visualiza indicadores gerais e simulação operacional.",
    email: "admin@vittas.com.br",
    destino: "/dashboard",
    icon: Building2,
  },
  {
    perfil: "Profissional",
    descricao: "Registra atendimento, orientação e atestado digital.",
    email: "profissional@vittas.com.br",
    destino: "/painel-profissional",
    icon: Stethoscope,
  },
];

function Login() {
  const navigate = useNavigate();
  const [credenciais, setCredenciais] = useState({
    email: "paciente@vittas.com.br",
    senha: "123456",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function preencherPerfil(email) {
    setCredenciais({ email, senha: "123456" });
    setErro("");
  }

  async function enviarLogin(event) {
    event.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const { data } = await loginApi(credenciais);
      salvarUsuario(data.usuario);
      if (data.usuario.pacienteId) {
        localStorage.setItem(
          "vittas_paciente_id",
          String(data.usuario.pacienteId),
        );
      }
      navigate(data.redirecionarPara);
    } catch (error) {
      const mensagem =
        error.response?.data?.detail ||
        error.mensagemAmigavel ||
        "Não foi possível entrar. Confira seus dados e tente novamente.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-vittas-gray">
      <InstitutionalHeader />

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
        <section className="rounded-lg border border-vittas-border bg-white p-5 shadow-sm lg:p-7">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase text-vittas-green">
              Portal VITTAS
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-vittas-navy">
              Acesso ao sistema
            </h1>
            <p className="mt-3 leading-7 text-vittas-muted">
              Escolha um perfil de demonstração ou entre com seu e-mail e senha.
            </p>
          </div>

          <form className="space-y-4" onSubmit={enviarLogin}>
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-vittas-navy">
                <Mail size={16} aria-hidden="true" />
                E-mail
              </span>
              <input
                className="w-full rounded-lg border border-vittas-border bg-white px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
                onChange={(event) =>
                  setCredenciais((atual) => ({
                    ...atual,
                    email: event.target.value,
                  }))
                }
                autoComplete="username"
                required
                type="email"
                value={credenciais.email}
              />
            </label>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-vittas-navy">
                <LockKeyhole size={16} aria-hidden="true" />
                Senha
              </span>
              <input
                className="w-full rounded-lg border border-vittas-border bg-white px-3 py-3 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
                onChange={(event) =>
                  setCredenciais((atual) => ({
                    ...atual,
                    senha: event.target.value,
                  }))
                }
                autoComplete="current-password"
                required
                type="password"
                value={credenciais.senha}
              />
            </label>

            {erro && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-vittas-danger"
              >
                {erro}
              </p>
            )}

            <Button className="w-full" disabled={carregando} type="submit">
              {carregando ? "Entrando..." : "Entrar no portal"}
            </Button>
          </form>

          <div className="mt-5 rounded-lg bg-vittas-slate p-4 text-sm leading-6 text-vittas-muted">
            <p className="font-semibold text-vittas-navy">
              Senha dos usuários simulados: 123456
            </p>
            <p className="mt-1">
              Ainda não tem cadastro?{" "}
              <Link className="font-bold text-vittas-blue" to="/cadastro">
                Cadastrar paciente
              </Link>
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm font-bold uppercase text-vittas-green">
              Perfis de demonstração
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-vittas-navy">
              Escolha o seu perfil
            </h2>
          </div>

          <div className="role-directory">
            {perfisTeste.map((perfil) => {
              const Icon = perfil.icon;
              const ativo = credenciais.email === perfil.email;

              return (
                <button
                  aria-pressed={ativo}
                  className={`role-entry text-left ${
                    ativo
                      ? "border-vittas-blue ring-2 ring-blue-100"
                      : "border-vittas-border"
                  }`}
                  key={perfil.email}
                  onClick={() => preencherPerfil(perfil.email)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-vittas-blueSoft text-vittas-blue">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    {ativo && (
                      <ShieldCheck
                        className="h-5 w-5 text-vittas-green"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span className="role-name block text-lg font-bold text-vittas-navy">
                    {perfil.perfil}
                  </span>
                  <span className="role-description block text-sm leading-6 text-vittas-muted">
                    {perfil.descricao}
                  </span>
                  <span className="role-email block break-all text-sm font-semibold text-vittas-blue">
                    {perfil.email}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export default Login;
