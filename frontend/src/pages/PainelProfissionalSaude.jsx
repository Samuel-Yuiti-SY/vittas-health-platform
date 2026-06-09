import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Save, SquareCheckBig, UsersRound } from 'lucide-react';

import {
  finalizarAtendimento,
  listarPacientes,
  listarPacientesEncaminhados,
  listarProfissionais,
  listarUnidades,
  obterHistoricoPaciente,
  obterTriagem,
  registrarResultadoAtendimento,
} from '../api/api.js';
import AtestadoDigital from '../components/AtestadoDigital.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import InfoCard from '../components/InfoCard.jsx';
import HistoricoAtendimento from '../components/HistoricoAtendimento.jsx';
import PacienteCard from '../components/PacienteCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import UnidadeCard from '../components/UnidadeCard.jsx';
import { formatarDataHora } from '../utils/formatters.js';

const estadoInicial = {
  resultado: '',
  orientacao: '',
  medicacao: '',
  intervaloMedicacao: '',
  observacoes: '',
  dataRetorno: '',
  horarioRetorno: '',
  passagemEnfermeiro: '',
  previsaoAcompanhamento: '',
  gerarAtestadoDigital: false,
  diasAtestado: 1,
  cidObservacao: '',
};

function RespostaTriagem({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-vittas-navy">{value}</p>
    </div>
  );
}

function PainelProfissionalSaude() {
  const [linhas, setLinhas] = useState([]);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [form, setForm] = useState(estadoInicial);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [atestado, setAtestado] = useState(null);

  async function carregar() {
    setErro('');
    try {
      const [encaminhadosResp, pacientesResp, unidadesResp, profissionaisResp] = await Promise.all([
        listarPacientesEncaminhados(),
        listarPacientes(),
        listarUnidades(),
        listarProfissionais(),
      ]);
      const triagens = await Promise.all(encaminhadosResp.data.map((atendimento) => obterTriagem(atendimento.triagemId).then((res) => res.data)));
      const montadas = encaminhadosResp.data.map((atendimento, index) => ({
        atendimento,
        paciente: pacientesResp.data.find((item) => item.id === atendimento.pacienteId),
        unidade: unidadesResp.data.find((item) => item.id === atendimento.unidadeId),
        triagem: triagens[index],
      }));
      setLinhas(montadas);
      setProfissionais(profissionaisResp.data);
      if (!selecionadoId && montadas[0]) setSelecionadoId(montadas[0].atendimento.id);
    } catch (error) {
      setErro(error.response?.data?.detail || 'Nao foi possivel carregar pacientes encaminhados.');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const selecionado = useMemo(
    () => linhas.find((linha) => linha.atendimento.id === selecionadoId) || null,
    [linhas, selecionadoId],
  );

  useEffect(() => {
    async function carregarHistorico() {
      if (!selecionado?.paciente?.id) {
        setHistorico([]);
        return;
      }
      try {
        const { data } = await obterHistoricoPaciente(selecionado.paciente.id);
        setHistorico(data);
      } catch {
        setHistorico([]);
      }
    }
    carregarHistorico();
  }, [selecionado?.paciente?.id]);

  function atualizarCampo(event) {
    const { name, type, checked, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: type === 'checkbox' ? checked : value }));
  }

  async function salvarResultado() {
    setErro('');
    setMensagem('');
    if (!selecionado) {
      setErro('Selecione um paciente encaminhado antes de salvar.');
      return;
    }
    if (!form.resultado.trim() || !form.orientacao.trim()) {
      setErro('Informe resumo do atendimento e orientacao ao paciente.');
      return;
    }
    try {
      const payload = {
        ...form,
        profissionalId: profissionais[0]?.id,
        diasAtestado: Number(form.diasAtestado || 1),
      };
      const { data } = await registrarResultadoAtendimento(selecionado.atendimento.id, payload);
      setAtestado(data.atestadoDigital);
      setLinhas((atuais) => atuais.map((linha) => (
        linha.atendimento.id === data.id ? { ...linha, atendimento: data } : linha
      )));
      setMensagem('Resultado salvo. Nenhuma medicacao foi sugerida automaticamente; apenas o texto digitado foi registrado.');
    } catch (error) {
      setErro(error.response?.data?.detail || 'Nao foi possivel salvar o resultado.');
    }
  }

  async function concluirAtendimento() {
    setErro('');
    setMensagem('');
    if (!selecionado) {
      setErro('Selecione um paciente para finalizar.');
      return;
    }
    try {
      await finalizarAtendimento(selecionado.atendimento.id);
      setMensagem('Atendimento finalizado e historico atualizado para o paciente.');
      setForm(estadoInicial);
      setAtestado(null);
      setSelecionadoId(null);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.detail || 'Salve resumo e orientacao antes de finalizar.');
    }
  }

  return (
    <AdminLayout
      description="Registre resumo, orientacao, medicacao digitada manualmente e atestado quando necessario."
      eyebrow="Profissional da saude"
      title="Painel profissional"
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard helper="Pacientes encaminhados para avaliacao" icon={UsersRound} label="Encaminhados" value={linhas.length} />
        <InfoCard helper="Atendimento aberto no momento" icon={ClipboardList} label="Selecionado" tone="green" value={selecionado ? '1' : '0'} />
      </div>

      <div className="grid w-full gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="space-y-4">
        <div className="space-y-3">
          {linhas.map(({ atendimento, paciente, triagem, unidade }) => (
            <button
              className={`w-full rounded-lg bg-white p-4 text-left shadow-sm ring-1 transition ${
                selecionadoId === atendimento.id ? 'ring-vittas-blue' : 'ring-slate-100'
              }`}
              key={atendimento.id}
              onClick={() => setSelecionadoId(atendimento.id)}
              type="button"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-vittas-navy">{paciente?.nome}</p>
                  <p className="text-sm text-slate-500">{unidade?.nome}</p>
                  <p className="mt-1 text-sm text-slate-600">{triagem?.sintomas?.join(', ')}</p>
                </div>
                <StatusBadge status={triagem?.classificacao} />
              </div>
            </button>
          ))}
          {!linhas.length && <Card><p className="text-sm text-slate-600">Nenhum paciente encaminhado no momento.</p></Card>}
        </div>
      </section>

      <section className="space-y-4">
        {selecionado ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <PacienteCard paciente={selecionado.paciente} />
              <UnidadeCard unidade={selecionado.unidade} especialidade={selecionado.triagem?.especialidadeRecomendada} />
            </div>

            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-vittas-navy">Triagem e check-in</p>
                  <p className="mt-1 text-sm text-slate-600">{formatarDataHora(selecionado.atendimento.dataCheckin)}</p>
                </div>
                <StatusBadge status={selecionado.atendimento.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selecionado.triagem?.sintomas?.map((sintoma) => (
                  <span className="rounded-full bg-vittas-gray px-3 py-1 text-xs font-semibold text-slate-700" key={sintoma}>{sintoma}</span>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-vittas-navy">Score {selecionado.triagem?.scorePrioridade}</p>
            </Card>

            <Card>
              <p className="font-semibold text-vittas-navy">Respostas da pre-triagem</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <RespostaTriagem label="Desde quando" value={selecionado.triagem?.inicioSintomas || 'Nao informado'} />
                <RespostaTriagem label="Febre verificada" value={selecionado.triagem?.verificouFebre ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Falta de ar intensa" value={selecionado.triagem?.faltaArIntensa ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Desmaio" value={selecionado.triagem?.desmaio ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Convulsao" value={selecionado.triagem?.convulsao ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Sangramento intenso" value={selecionado.triagem?.sangramentoIntenso ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Acidente grave" value={selecionado.triagem?.acidenteGrave ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Suspeita de AVC" value={selecionado.triagem?.suspeitaAvc ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Gestante" value={selecionado.triagem?.gestante ? 'Sim' : 'Nao'} />
                <RespostaTriagem label="Prioridade" value={selecionado.triagem?.idoso ? 'Idoso' : selecionado.triagem?.crianca ? 'Crianca' : selecionado.triagem?.condicaoPrioritaria ? 'Outra prioridade' : 'Nao informada'} />
              </div>
            </Card>

            <Card>
              <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-vittas-navy">
                O sistema nao sugere medicamento nem gera diagnostico automatico. O profissional deve preencher todos os campos manualmente.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Resumo do atendimento</span>
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="resultado" onChange={atualizarCampo} value={form.resultado} />
                </label>
                <label className="md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Orientacao ao paciente</span>
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="orientacao" onChange={atualizarCampo} value={form.orientacao} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Medicacao prescrita manualmente</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="medicacao" onChange={atualizarCampo} value={form.medicacao} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Intervalo de uso</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="intervaloMedicacao" onChange={atualizarCampo} value={form.intervaloMedicacao} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Data de retorno</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="dataRetorno" onChange={atualizarCampo} type="date" value={form.dataRetorno} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Horario de retorno</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="horarioRetorno" onChange={atualizarCampo} type="time" value={form.horarioRetorno} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Passagem pelo enfermeiro</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="passagemEnfermeiro" onChange={atualizarCampo} value={form.passagemEnfermeiro} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Previsao de acompanhamento</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="previsaoAcompanhamento" onChange={atualizarCampo} value={form.previsaoAcompanhamento} />
                </label>
                <label className="md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Observacoes</span>
                  <textarea className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="observacoes" onChange={atualizarCampo} value={form.observacoes} />
                </label>
                <label className="flex items-center gap-3 rounded-lg bg-vittas-gray p-3 text-sm font-semibold text-vittas-navy">
                  <input checked={form.gerarAtestadoDigital} name="gerarAtestadoDigital" onChange={atualizarCampo} type="checkbox" />
                  Gerar atestado digital
                </label>
                <label>
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Dias de atestado</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" min="1" name="diasAtestado" onChange={atualizarCampo} type="number" value={form.diasAtestado} />
                </label>
                <label className="md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-vittas-navy">Observacao/CID opcional</span>
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm" name="cidObservacao" onChange={atualizarCampo} value={form.cidObservacao} />
                </label>
              </div>

              {erro && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-vittas-danger">{erro}</p>}
              {mensagem && <p className="mt-4 rounded-lg bg-vittas-mint px-3 py-2 text-sm font-medium text-vittas-navy">{mensagem}</p>}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button onClick={salvarResultado}>
                  <Save size={18} aria-hidden="true" />
                  Salvar resultado
                </Button>
                <Button onClick={concluirAtendimento} variant="secondary">
                  <SquareCheckBig size={18} aria-hidden="true" />
                  Finalizar atendimento
                </Button>
              </div>
            </Card>

            {atestado && <AtestadoDigital atestado={atestado} />}
            <div>
              <h2 className="mb-3 text-xl font-bold text-vittas-navy">Historico anterior</h2>
              <HistoricoAtendimento historico={historico} />
            </div>
          </>
        ) : (
          <Card>
            <h2 className="text-xl font-bold text-vittas-navy">Nenhum paciente selecionado</h2>
            <p className="mt-2 text-slate-600">Selecione um paciente encaminhado para registrar o atendimento.</p>
          </Card>
        )}
      </section>
      </div>
    </AdminLayout>
  );
}

export default PainelProfissionalSaude;
