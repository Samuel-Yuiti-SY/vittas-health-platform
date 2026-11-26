import {
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  MapPinned,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import Button from "../components/Button.jsx";
import InstitutionalHeader from "../components/InstitutionalHeader.jsx";
import PublicFooter from "../components/PublicFooter.jsx";

const servicos = [
  {
    icon: ClipboardList,
    title: "Pré-triagem orientada",
    description:
      "Informe sintomas e confirme seu bairro para conhecer o fluxo de atendimento.",
  },
  {
    icon: Clock,
    title: "Acompanhamento da fila",
    description:
      "Consulte posição, prioridade e tempo estimado na fila demonstrativa.",
  },
  {
    icon: MapPinned,
    title: "Recomendação de unidade",
    description:
      "Veja a unidade sugerida conforme os dados informados na simulação.",
  },
  {
    icon: Stethoscope,
    title: "Área das equipes",
    description:
      "Recepção, profissionais e gestão acompanham cada etapa do atendimento.",
  },
];
const passos = [
  [
    "Identifique-se",
    "Entre com um dos perfis de demonstração ou faça o cadastro de paciente.",
  ],
  [
    "Converse com o Vitti",
    "Responda às perguntas iniciais sobre sintomas e localização.",
  ],
  [
    "Acompanhe o atendimento",
    "Consulte a recomendação e o andamento da fila virtual.",
  ],
];

export default function Home() {
  return (
    <div className="vittas-public">
      <InstitutionalHeader />
      <main>
        <section className="health-hero" aria-labelledby="home-title">
          <div className="health-container health-hero-grid">
            <div className="health-intro">
              <p className="health-eyebrow">PORTAL DO PACIENTE</p>
              <h1 id="home-title">
                Seu caminho até o <em>atendimento.</em>
              </h1>
              <p className="health-lead">
                Pré-triagem, indicação de unidade e fila virtual. Um projeto
                acadêmico para explorar como pacientes e equipes podem
                acompanhar o mesmo fluxo de cuidado.
              </p>
              <div className="health-actions">
                <Button to="/login">
                  Iniciar pré-triagem <ArrowRight size={18} aria-hidden />
                </Button>
                <Button to="/cadastro" variant="ghost">
                  Cadastrar paciente
                </Button>
              </div>
              <p className="health-disclosure">
                <ShieldCheck size={18} aria-hidden />
                <span>
                  Ambiente demonstrativo. Utilize apenas dados fictícios.
                </span>
              </p>
            </div>
            <img
              className="care-photo"
              src="/images/acolhimento.webp"
              alt=""
              width="1152"
              height="648"
              fetchPriority="high"
            />
          </div>
        </section>
        <div className="health-container guide-strip">
          <aside className="care-guide" id="guia" aria-labelledby="guia-title">
            <div className="care-guide-heading">
              <span className="guide-symbol">
                <ClipboardList size={25} aria-hidden />
              </span>
              <p>GUIA DO PACIENTE</p>
            </div>
            <h2 id="guia-title">Antes de começar</h2>
            <p className="guide-description">
              Do cadastro ao acompanhamento da fila virtual.
            </p>
            <ol>
              {passos.map(([title, text], index) => (
                <li key={title}>
                  <span className="guide-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="guide-emergency">
              <strong>Precisa de ajuda urgente?</strong>
              <p>
                Em uma emergência real, <a href="tel:192">ligue 192</a>. A
                simulação não substitui atendimento médico.
              </p>
            </div>
          </aside>
        </div>
        <section
          id="servicos"
          className="health-container health-services"
          aria-labelledby="servicos-title"
        >
          <div className="health-section-heading">
            <p className="health-eyebrow">RECURSOS DO PROJETO</p>
            <h2 id="servicos-title">Serviços do portal</h2>
          </div>
          <div className="health-service-list">
            {servicos.map(({ icon: Icon, title, description }, index) => (
              <article key={title}>
                <span className="service-index">0{index + 1}</span>
                <Icon size={23} aria-hidden />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="como-funciona"
          className="health-flow"
          aria-labelledby="fluxo-title"
        >
          <div className="health-container health-flow-grid">
            <div>
              <p className="health-eyebrow">PACIENTE E EQUIPE</p>
              <h2 id="fluxo-title">Informação que acompanha o cuidado.</h2>
              <p>
                O VITTAS reúne o cadastro, a organização inicial da demanda e o
                registro profissional. Os quatro perfis de teste permitem
                conhecer o processo de diferentes pontos de vista.
              </p>
            </div>
            <div className="health-roles">
              {[
                ["Paciente", "Pré-triagem e acompanhamento"],
                ["Recepção", "Organização e chamada da fila"],
                ["Profissional", "Registro do atendimento"],
                ["Gestão", "Indicadores da demonstração"],
              ].map(([role, detail]) => (
                <div key={role}>
                  <strong>{role}</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="unidades"
          className="health-container health-units"
          aria-labelledby="unidades-title"
        >
          <div>
            <p className="health-eyebrow">CONTEXTO LOCAL · MARINGÁ</p>
            <h2 id="unidades-title">O bairro faz parte do percurso.</h2>
            <p>
              A demonstração considera o bairro informado e a prioridade
              simulada para sugerir uma unidade. Explore o fluxo sem realizar um
              agendamento real.
            </p>
          </div>
          <ul>
            {[
              [Building2, "UBS", "Atenção básica e demandas de rotina."],
              [ShieldCheck, "UPA", "Atendimento de urgência."],
              [
                Stethoscope,
                "Hospital",
                "Referência para casos mais complexos.",
              ],
            ].map(([Icon, title, text]) => (
              <li key={title}>
                <Icon size={22} aria-hidden />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
