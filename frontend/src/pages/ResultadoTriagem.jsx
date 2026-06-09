import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Clock, FileText, Home, PhoneCall, RefreshCw, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { entrarNaFila, obterMensagemErro } from '../api/api.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import InfoCard from '../components/InfoCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PatientSummaryCard from '../components/PatientSummaryCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import UnidadeCard from '../components/UnidadeCard.jsx';
import { obterResultadoTriagem, salvarAtendimentoAtual, tempoBasePorScore, textoPrioridade } from '../utils/formatters.js';

function ResultadoTriagem() {
  const navigate = useNavigate();
  const resultado = obterResultadoTriagem();
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!resultado?.triagem) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-xl items-center px-4">
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-vittas-navy">Nenhuma triagem encontrada</h1>
          <p className="mt-2 text-vittas-muted">Refaca a pre-triagem para visualizar a recomendacao.</p>
          <div className="mt-5">
            <Button to="/pre-triagem">Ir para pre-triagem</Button>
          </div>
        </Card>
      </div>
    );
  }

  const { triagem, unidade, paciente } = resultado;
  const emergencia = triagem.classificacao === 'Emergencia';
  const alertaDorPeito = triagem.sintomas?.includes('Dor no peito') && !emergencia;
  const tempoBase = tempoBasePorScore(triagem.scorePrioridade, unidade?.tempoMedio);

  async function entrarFila() {
    setErro('');
    setCarregando(true);
    try {
      const { data } = await entrarNaFila({
        pacienteId: triagem.pacienteId,
        triagemId: triagem.id,
        unidadeId: triagem.unidadeRecomendadaId,
      });
      salvarAtendimentoAtual(data);
      navigate('/fila-paciente');
    } catch (error) {
      setErro(obterMensagemErro(error, 'Nao foi possivel entrar na fila agora. Verifique se a API esta ativa.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <PageHeader
        actions={(
          <>
            <Button to="/pre-triagem" variant="ghost">
              <RefreshCw size={18} aria-hidden="true" />
              Refazer
            </Button>
            <Button to="/" variant="ghost">
              <Home size={18} aria-hidden="true" />
              Inicio
            </Button>
          </>
        )}
        description={textoPrioridade(triagem.classificacao)}
        eyebrow="Resultado da triagem"
        title={paciente?.nome || 'Paciente'}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <section className="space-y-4">
          {emergencia && (
            <Card className="border-l-4 border-l-vittas-danger bg-red-50">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 h-7 w-7 shrink-0 text-vittas-danger" aria-hidden="true" />
                <div>
                  <h2 className="text-xl font-bold text-vittas-danger">Emergencia identificada</h2>
                  <p className="mt-2 leading-7 text-red-800">
                    Em sinais graves, ligue 192 ou procure atendimento imediato. A fila virtual nao deve atrasar o cuidado.
                  </p>
                  <a
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-vittas-danger px-4 py-2 text-sm font-bold text-white"
                    href="tel:192"
                  >
                    <PhoneCall size={18} aria-hidden="true" />
                    Ligar para 192
                  </a>
                </div>
              </div>
            </Card>
          )}

          {alertaDorPeito && (
            <Card className="border-yellow-200 bg-vittas-warningSoft">
              <p className="font-bold text-yellow-900">Atencao sobre dor no peito</p>
              <p className="mt-2 text-sm leading-6 text-yellow-900">
                A dor no peito pode ter varias causas e deve ser avaliada por um profissional de saude.
                Se houver piora rapida, falta de ar intensa ou desmaio, procure atendimento imediato.
              </p>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              helper="Classificacao simulada"
              icon={AlertTriangle}
              label="Prioridade"
              tone={emergencia ? 'red' : 'blue'}
              value={<StatusBadge status={triagem.classificacao} />}
            />
            <InfoCard
              helper="Quanto maior, maior prioridade na fila"
              icon={FileText}
              label="Score"
              value={triagem.scorePrioridade}
            />
            <InfoCard
              helper="Area indicada para atendimento"
              icon={Stethoscope}
              label="Especialidade"
              value={triagem.especialidadeRecomendada}
            />
            <InfoCard
              helper="Por posicao na fila"
              icon={Clock}
              label="Tempo base"
              tone="green"
              value={`${tempoBase} min`}
            />
          </div>

          <Card>
            <p className="font-bold text-vittas-navy">Orientacao do Vitti</p>
            <p className="mt-2 text-sm leading-6 text-vittas-muted">
              {triagem.mensagem || textoPrioridade(triagem.classificacao)}
            </p>
            <p className="mt-3 rounded-lg bg-vittas-slate p-3 text-xs font-semibold leading-5 text-vittas-muted">
              Este sistema e um MVP academico. As informacoes sao simuladas e nao substituem avaliacao medica profissional.
            </p>
          </Card>

          {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-vittas-danger">{erro}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            {!emergencia && (
              <Button disabled={carregando} onClick={entrarFila}>
                {carregando ? 'Entrando...' : 'Entrar na fila virtual'}
              </Button>
            )}
            {emergencia && (
              <Button disabled={carregando} onClick={entrarFila} variant="ghost">
                {carregando ? 'Registrando...' : 'Registrar entrada mesmo assim'}
              </Button>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <PatientSummaryCard paciente={paciente} title="Paciente" />
          <UnidadeCard unidade={unidade} especialidade={triagem.especialidadeRecomendada} />
          <Card>
            <p className="font-bold text-vittas-navy">Sintomas informados</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {triagem.sintomas?.map((sintoma) => (
                <span className="rounded-full bg-vittas-slate px-3 py-1 text-xs font-semibold text-vittas-muted" key={sintoma}>
                  {sintoma}
                </span>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate(-1)} variant="ghost">
              <ArrowLeft size={18} aria-hidden="true" />
              Voltar
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default ResultadoTriagem;
