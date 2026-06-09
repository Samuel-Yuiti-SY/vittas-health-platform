import {
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  FileText,
  MapPinned,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

import Button from '../components/Button.jsx';
import InstitutionalHeader from '../components/InstitutionalHeader.jsx';
import PublicFooter from '../components/PublicFooter.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import StepCard from '../components/StepCard.jsx';

const servicos = [
  {
    title: 'Pre-triagem orientada',
    description: 'Coleta sintomas, prioridade e especialidade desejada antes do check-in virtual.',
    icon: ClipboardList,
  },
  {
    title: 'Fila virtual',
    description: 'Mostra status, posicao e tempo estimado do atendimento simulado.',
    icon: Clock,
  },
  {
    title: 'Unidade recomendada',
    description: 'Usa o bairro do paciente, tipo de atendimento e prioridade para sugerir UBS, UPA ou hospital.',
    icon: MapPinned,
  },
  {
    title: 'Painel das equipes',
    description: 'Apoia funcionarios e profissionais na organizacao da fila e registro do atendimento.',
    icon: Stethoscope,
  },
];

const passos = [
  {
    title: 'Informe seus dados',
    description: 'O paciente entra com nome, contato e bairro para direcionar melhor o atendimento.',
  },
  {
    title: 'Responda a pre-triagem',
    description: 'O Vitti faz perguntas iniciais e alerta casos que precisam de atencao imediata.',
  },
  {
    title: 'Acompanhe a fila',
    description: 'Depois da recomendacao, o paciente entra na fila virtual e acompanha o status.',
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-vittas-gray">
      <InstitutionalHeader />

      <main>
        <section className="border-b border-vittas-border bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-vittas-mint px-3 py-1 text-xs font-bold uppercase text-vittas-greenDark">
                MVP academico para saude publica
              </div>
              <div>
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-normal text-vittas-navy sm:text-5xl">
                  Atendimento digital para saude publica com mais agilidade
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-vittas-muted">
                  O VITTAS organiza pre-triagem, fila virtual e recomendacao de unidade de saude para
                  demonstrar um fluxo mais claro entre paciente, recepcao e profissional.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button to="/login">
                  Acessar sistema
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
                <Button to="/cadastro" variant="ghost">
                  Cadastrar paciente
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-vittas-border bg-vittas-slate p-4">
                  <p className="text-2xl font-extrabold text-vittas-navy">4</p>
                  <p className="mt-1 text-sm font-semibold text-vittas-muted">perfis simulados</p>
                </div>
                <div className="rounded-lg border border-vittas-border bg-vittas-slate p-4">
                  <p className="text-2xl font-extrabold text-vittas-navy">Maringa</p>
                  <p className="mt-1 text-sm font-semibold text-vittas-muted">bairros e unidades</p>
                </div>
                <div className="rounded-lg border border-vittas-border bg-vittas-slate p-4">
                  <p className="text-2xl font-extrabold text-vittas-navy">192</p>
                  <p className="mt-1 text-sm font-semibold text-vittas-muted">alerta emergencial</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-vittas-border bg-vittas-slate p-4">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-vittas-border pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-vittas-green">Fluxo do atendimento</p>
                    <h2 className="mt-1 text-xl font-extrabold text-vittas-navy">Central VITTAS</h2>
                  </div>
                  <span className="rounded-full bg-vittas-mint px-3 py-1 text-xs font-bold text-vittas-greenDark">
                    Online
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    ['Paciente', 'Cadastro e bairro informados', UserLine],
                    ['Vitti', 'Pre-triagem inicial registrada', ClipboardList],
                    ['Recepcao', 'Fila priorizada por score', Building2],
                    ['Profissional', 'Registro manual do atendimento', FileText],
                  ].map(([titulo, texto, Icon]) => (
                    <div className="flex items-center gap-3 rounded-lg border border-vittas-border bg-vittas-gray p-3" key={titulo}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vittas-blueSoft text-vittas-blue">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-bold text-vittas-navy">{titulo}</p>
                        <p className="text-sm text-vittas-muted">{texto}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg bg-vittas-warningSoft p-3 text-sm font-semibold leading-6 text-yellow-900">
                  Sistema demonstrativo com dados simulados. Nao substitui atendimento medico real.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-vittas-gray py-10" id="servicos">
          <div className="mx-auto max-w-7xl px-4">
            <SectionTitle
              description="O MVP conecta etapas que hoje costumam ficar separadas: entrada do paciente, triagem, recepcao, fila e registro profissional."
              eyebrow="Servicos"
              title="Uma base organizada para o atendimento"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {servicos.map((servico) => (
                <ServiceCard key={servico.title} {...servico} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-vittas-border bg-white py-10" id="como-funciona">
          <div className="mx-auto max-w-7xl px-4">
            <SectionTitle
              align="center"
              description="O sistema mantem o paciente informado e ajuda a equipe a enxergar prioridade, unidade e historico de forma simples."
              eyebrow="Como funciona"
              title="Do cadastro ao acompanhamento da fila"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {passos.map((passo, index) => (
                <StepCard key={passo.title} number={index + 1} {...passo} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vittas-gray py-10" id="unidades">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionTitle
              description="A recomendacao da unidade considera o bairro salvo no cadastro ou confirmado antes da pre-triagem. Assim, o fluxo simulado fica mais proximo da realidade local."
              eyebrow="Maringa"
              title="Bairros e unidades no centro da decisao"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <ServiceCard
                description="Casos leves e de rotina priorizam unidades basicas quando compativel."
                icon={Building2}
                title="UBS"
              />
              <ServiceCard
                description="Casos de alta prioridade sao direcionados para atendimento mais rapido."
                icon={ShieldCheck}
                title="UPA"
              />
              <ServiceCard
                description="Alertas graves mantem orientacao clara de emergencia e ligacao 192."
                icon={Stethoscope}
                title="Hospital"
              />
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function UserLine(props) {
  return <ShieldCheck {...props} />;
}

export default Home;
