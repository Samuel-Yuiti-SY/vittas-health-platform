import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, FileText, History, Home, ListChecks, MessageCircle, RefreshCw } from 'lucide-react';

import { obterAtendimento, obterFilaPaciente, obterHistoricoPaciente, obterPaciente, obterTriagem, obterUnidade } from '../api/api.js';
import AtestadoDigital from '../components/AtestadoDigital.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import HistoricoAtendimento from '../components/HistoricoAtendimento.jsx';
import InfoCard from '../components/InfoCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PatientSummaryCard from '../components/PatientSummaryCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import UnidadeCard from '../components/UnidadeCard.jsx';
import {
  formatarDataHora,
  obterAtendimentoAtual,
  obterPacienteAtual,
  obterResultadoTriagem,
  salvarAtendimentoAtual,
  salvarPacienteAtual,
  usuarioAtual,
} from '../utils/formatters.js';

const statusLinhaTempo = ['Aguardando', 'Chamado', 'Em atendimento', 'Encaminhado', 'Finalizado'];

function FilaPaciente() {
  const usuario = usuarioAtual();
  const [resultadoLocal] = useState(() => obterResultadoTriagem());
  const [atendimentoLocal] = useState(() => obterAtendimentoAtual());
  const [pacienteAtual] = useState(() => obterPacienteAtual());
  const [dados, setDados] = useState({
    paciente: resultadoLocal?.paciente || pacienteAtual || null,
    atendimento: atendimentoLocal,
    triagem: resultadoLocal?.triagem || null,
    unidade: resultadoLocal?.unidade || null,
    historico: [],
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const pacienteId = useMemo(
    () => usuario?.pacienteId || resultadoLocal?.paciente?.id || pacienteAtual?.id || localStorage.getItem('vittas_paciente_id') || dados.paciente?.id,
    [dados.paciente?.id, pacienteAtual?.id, resultadoLocal?.paciente?.id, usuario?.pacienteId],
  );

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      let paciente = resultadoLocal?.paciente || pacienteAtual || null;
      let atendimento = null;
      let triagem = resultadoLocal?.triagem || null;
      let unidade = resultadoLocal?.unidade || null;
      let historico = [];

      if (pacienteId) {
        const [pacienteResp, historicoResp, filaResp] = await Promise.allSettled([
          obterPaciente(pacienteId),
          obterHistoricoPaciente(pacienteId),
          obterFilaPaciente(pacienteId),
        ]);
        if (pacienteResp.status === 'fulfilled') paciente = pacienteResp.value.data;
        if (historicoResp.status === 'fulfilled') historico = historicoResp.value.data;
        if (filaResp.status === 'fulfilled' && filaResp.value.data) atendimento = filaResp.value.data;
      }

      if (!atendimento && atendimentoLocal?.id) {
        const atendimentoResp = await obterAtendimento(atendimentoLocal.id);
        atendimento = atendimentoResp.data;
      }

      if (atendimento?.triagemId) {
        const triagemResp = await obterTriagem(atendimento.triagemId);
        triagem = triagemResp.data;
      }
      if (atendimento?.unidadeId) {
        const unidadeResp = await obterUnidade(atendimento.unidadeId);
        unidade = unidadeResp.data;
      }

      if (paciente) salvarPacienteAtual(paciente);
      if (atendimento) salvarAtendimentoAtual(atendimento);
      setDados({ paciente, atendimento, triagem, unidade, historico });
    } catch (error) {
      setErro(error.response?.data?.detail || 'Nao foi possivel carregar a fila. Usando dados locais quando disponiveis.');
    } finally {
      setCarregando(false);
    }
  }, [atendimentoLocal?.id, pacienteAtual, pacienteId, resultadoLocal?.paciente, resultadoLocal?.triagem, resultadoLocal?.unidade]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const ultimoHistorico = dados.historico?.[dados.historico.length - 1];
  const atestado = dados.atendimento?.atestadoDigital || ultimoHistorico?.atestadoDigital;
  const semAtendimento = !dados.atendimento;
  const indiceStatus = Math.max(statusLinhaTempo.indexOf(dados.atendimento?.status), 0);

  if (semAtendimento) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-2xl items-center px-4 py-6">
        <Card className="w-full text-center">
          <p className="text-sm font-bold uppercase text-vittas-green">Fila virtual</p>
          <h1 className="mt-2 text-2xl font-bold text-vittas-navy">Voce ainda nao entrou na fila</h1>
          <p className="mt-3 leading-7 text-vittas-muted">
            Faca a pre-triagem com o Vitti para receber a unidade recomendada e iniciar o check-in virtual.
          </p>
          {erro && <p className="mt-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800">{erro}</p>}
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/pre-triagem">
              <MessageCircle size={18} aria-hidden="true" />
              Ir para pre-triagem
            </Button>
            <Button to="/" variant="ghost">
              <Home size={18} aria-hidden="true" />
              Voltar para inicio
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <PageHeader
        actions={(
          <>
            <Button onClick={carregar} disabled={carregando}>
              <RefreshCw size={18} aria-hidden="true" />
              Atualizar
            </Button>
            <Button to="/pre-triagem" variant="ghost">
              <MessageCircle size={18} aria-hidden="true" />
              Nova pre-triagem
            </Button>
          </>
        )}
        description="Acompanhe status, posicao, tempo estimado, unidade e orientacoes do atendimento simulado."
        eyebrow="Fila virtual"
        title={dados.paciente?.nome || 'Paciente'}
      />

      {erro && <p className="mt-5 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800">{erro}</p>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              helper="Situacao atual"
              icon={ListChecks}
              label="Status"
              value={<StatusBadge status={dados.atendimento.status} />}
            />
            <InfoCard
              helper="Ordem estimada por prioridade"
              icon={History}
              label="Posicao"
              tone="green"
              value={dados.atendimento.posicaoFila ? `${dados.atendimento.posicaoFila}o` : '-'}
            />
            <InfoCard
              helper="Estimativa da unidade"
              icon={Clock}
              label="Tempo"
              tone="yellow"
              value={dados.atendimento.tempoEstimado ? `${dados.atendimento.tempoEstimado} min` : '-'}
            />
            <InfoCard
              helper="Classificacao da triagem"
              icon={FileText}
              label="Prioridade"
              value={<StatusBadge status={dados.triagem?.classificacao || 'Nao informada'} />}
            />
          </div>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase text-vittas-green">Linha do tempo</p>
                <h2 className="mt-1 text-xl font-extrabold text-vittas-navy">Acompanhamento do atendimento</h2>
              </div>
              <StatusBadge status={dados.atendimento.status} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {statusLinhaTempo.map((status, index) => {
                const ativo = index <= indiceStatus;
                return (
                  <div
                    className={`rounded-lg border p-3 text-sm ${
                      ativo
                        ? 'border-vittas-blue bg-vittas-blueSoft text-vittas-navy'
                        : 'border-vittas-border bg-white text-vittas-muted'
                    }`}
                    key={status}
                  >
                    <p className="font-bold">{status}</p>
                    <p className="mt-1 text-xs font-semibold">{ativo ? 'Registrado' : 'Aguardando'}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3 text-sm text-vittas-muted sm:grid-cols-2">
              <p><span className="font-semibold text-vittas-navy">Check-in:</span> {formatarDataHora(dados.atendimento.dataCheckin)}</p>
              <p><span className="font-semibold text-vittas-navy">Ultimo check-in:</span> {formatarDataHora(dados.paciente?.ultimoCheckin)}</p>
              <p><span className="font-semibold text-vittas-navy">Unidade:</span> {dados.unidade?.nome || 'Nao informada'}</p>
              <p><span className="font-semibold text-vittas-navy">Especialidade:</span> {dados.triagem?.especialidadeRecomendada || 'Nao informada'}</p>
            </div>
          </Card>

          <Card id="orientacoes-paciente">
            <p className="flex items-center gap-2 font-bold text-vittas-navy">
              <FileText size={18} aria-hidden="true" />
              Orientacao mais recente
            </p>
            <p className="mt-2 text-sm leading-6 text-vittas-muted">
              {dados.atendimento.orientacao || ultimoHistorico?.orientacao || 'Ainda nao ha orientacao registrada para este atendimento.'}
            </p>
            {dados.atendimento.medicacao && (
              <p className="mt-2 text-sm text-vittas-muted">
                <span className="font-semibold text-vittas-navy">Medicacao digitada pelo profissional:</span> {dados.atendimento.medicacao}
              </p>
            )}
            {dados.atendimento.intervaloMedicacao && (
              <p className="mt-2 text-sm text-vittas-muted">
                <span className="font-semibold text-vittas-navy">Intervalo:</span> {dados.atendimento.intervaloMedicacao}
              </p>
            )}
          </Card>
        </section>

        <aside className="space-y-4">
          <PatientSummaryCard paciente={dados.paciente} />
          <UnidadeCard unidade={dados.unidade} especialidade={dados.triagem?.especialidadeRecomendada} />
          {atestado && <AtestadoDigital atestado={atestado} />}
          <Card className="bg-vittas-slate">
            <p className="text-sm font-semibold leading-6 text-vittas-navy">
              Permaneça atento ao chamado da unidade. Em piora rapida ou sintomas graves, procure atendimento imediato.
            </p>
          </Card>
        </aside>
      </div>

      <section className="mt-5" id="historico-paciente">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-vittas-navy">Historico e orientacoes</h2>
          <Button variant="ghost" onClick={() => document.getElementById('historico-paciente')?.scrollIntoView({ behavior: 'smooth' })}>
            <History size={18} aria-hidden="true" />
            Historico
          </Button>
        </div>
        <HistoricoAtendimento historico={dados.historico} />
      </section>
    </div>
  );
}

export default FilaPaciente;
