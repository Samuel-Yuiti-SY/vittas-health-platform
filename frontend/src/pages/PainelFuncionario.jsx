import { useEffect, useMemo, useState } from 'react';
import { Building2, ListChecks, PhoneCall, PlayCircle, Search, Send, SquareCheckBig, UsersRound, XCircle } from 'lucide-react';

import {
  atualizarStatusFila,
  chamarProximo,
  listarAtendimentos,
  listarPacientes,
  listarUnidades,
  obterTriagem,
} from '../api/api.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import InfoCard from '../components/InfoCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatarDataHora, mascararCpf } from '../utils/formatters.js';

function PainelFuncionario() {
  const [linhas, setLinhas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [filtros, setFiltros] = useState({ busca: '', unidade: '', prioridade: '', status: '' });
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setMensagem('');
    try {
      const [atendimentosResp, pacientesResp, unidadesResp] = await Promise.all([listarAtendimentos(), listarPacientes(), listarUnidades()]);
      const triagens = await Promise.all(atendimentosResp.data.map((atendimento) => obterTriagem(atendimento.triagemId).then((res) => res.data)));

      const montadas = atendimentosResp.data.map((atendimento, index) => {
        const paciente = pacientesResp.data.find((item) => item.id === atendimento.pacienteId);
        const unidade = unidadesResp.data.find((item) => item.id === atendimento.unidadeId);
        const triagem = triagens[index];
        return { atendimento, paciente, unidade, triagem };
      });

      const statusAtivos = new Set(['Aguardando', 'Chamado', 'Em atendimento', 'Encaminhado']);
      montadas.sort((a, b) => {
        const aAtivo = statusAtivos.has(a.atendimento.status);
        const bAtivo = statusAtivos.has(b.atendimento.status);
        if (aAtivo !== bAtivo) return aAtivo ? -1 : 1;
        const score = (b.triagem?.scorePrioridade || b.atendimento.scorePrioridade || 0)
          - (a.triagem?.scorePrioridade || a.atendimento.scorePrioridade || 0);
        if (score !== 0) return score;
        return new Date(a.atendimento.dataCheckin) - new Date(b.atendimento.dataCheckin);
      });

      setLinhas(montadas);
      setUnidades(unidadesResp.data);
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Nao foi possivel carregar a fila.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const linhasFiltradas = useMemo(() => {
    const busca = filtros.busca.toLowerCase().trim();
    return linhas.filter(({ atendimento, paciente, unidade, triagem }) => {
      const bateBusca =
        !busca ||
        paciente?.nome?.toLowerCase().includes(busca) ||
        paciente?.cpf?.toLowerCase().includes(busca) ||
        mascararCpf(paciente?.cpf).toLowerCase().includes(busca);
      const bateUnidade = !filtros.unidade || String(unidade?.id) === filtros.unidade;
      const batePrioridade = !filtros.prioridade || triagem?.classificacao === filtros.prioridade;
      const bateStatus = !filtros.status || atendimento.status === filtros.status;
      return bateBusca && bateUnidade && batePrioridade && bateStatus;
    });
  }, [filtros, linhas]);

  async function executarAcao(tipo, atendimentoId) {
    try {
      if (tipo === 'chamar') {
        await chamarProximo(filtros.unidade ? { unidadeId: Number(filtros.unidade) } : {});
        setMensagem('Proximo paciente chamado pela fila de prioridade.');
      } else {
        await atualizarStatusFila(atendimentoId, tipo);
        setMensagem(`Status atualizado para ${tipo}.`);
      }
      await carregar();
    } catch (error) {
      setMensagem(error.response?.data?.detail || 'Nao foi possivel executar a acao.');
    }
  }

  const ativos = linhas.filter(({ atendimento }) => ['Aguardando', 'Chamado', 'Em atendimento', 'Encaminhado'].includes(atendimento.status)).length;
  const prioridades = linhas.filter(({ triagem }) => ['Emergencia', 'Alta prioridade'].includes(triagem?.classificacao)).length;

  return (
    <AdminLayout
      actions={(
        <Button onClick={() => executarAcao('chamar')}>
          <PhoneCall size={18} aria-hidden="true" />
          Chamar proximo
        </Button>
      )}
      description="Gerencie a fila, chame pacientes e encaminhe para o profissional sem alterar o fluxo simulado."
      eyebrow="Atendimento"
      title="Painel funcionario"
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard helper="Pacientes ativos na operacao" icon={UsersRound} label="Fila ativa" value={ativos} />
        <InfoCard helper="Resultado depois dos filtros" icon={ListChecks} label="Visiveis" tone="green" value={linhasFiltradas.length} />
        <InfoCard helper="Emergencia ou alta prioridade" icon={PhoneCall} label="Prioritarios" tone="yellow" value={prioridades} />
        <InfoCard helper="Unidades simuladas carregadas" icon={Building2} label="Unidades" value={unidades.length} />
      </div>

      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-vittas-navy">
              <Search size={16} aria-hidden="true" />
              Buscar nome ou CPF
            </span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-vittas-blue focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setFiltros((atual) => ({ ...atual, busca: event.target.value }))}
              value={filtros.busca}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-vittas-navy">Unidade</span>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              onChange={(event) => setFiltros((atual) => ({ ...atual, unidade: event.target.value }))}
              value={filtros.unidade}
            >
              <option value="">Todas</option>
              {unidades.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-vittas-navy">Prioridade</span>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              onChange={(event) => setFiltros((atual) => ({ ...atual, prioridade: event.target.value }))}
              value={filtros.prioridade}
            >
              <option value="">Todas</option>
              <option>Emergencia</option>
              <option>Alta prioridade</option>
              <option>Media prioridade</option>
              <option>Baixa prioridade</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-vittas-navy">Status</span>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              onChange={(event) => setFiltros((atual) => ({ ...atual, status: event.target.value }))}
              value={filtros.status}
            >
              <option value="">Todos</option>
              <option>Aguardando</option>
              <option>Chamado</option>
              <option>Em atendimento</option>
              <option>Encaminhado</option>
              <option>Finalizado</option>
              <option>Cancelado</option>
            </select>
          </label>
        </div>
      </Card>

      {mensagem && <p className="mb-4 rounded-lg bg-vittas-mint px-3 py-2 text-sm font-medium text-vittas-navy">{mensagem}</p>}

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Sintomas</th>
                <th className="px-4 py-3">Prioridade</th>
                <th className="px-4 py-3">Fila</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linhasFiltradas.map(({ atendimento, paciente, unidade, triagem }) => (
                <tr key={atendimento.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-vittas-navy">{paciente?.nome}</p>
                    <p className="text-slate-500">{paciente?.idade} anos - {paciente?.bairro}</p>
                    <p className="text-slate-500">{mascararCpf(paciente?.cpf)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{unidade?.nome}</p>
                    <p className="text-slate-500">{unidade?.tipo}</p>
                  </td>
                  <td className="px-4 py-4 max-w-xs">{triagem?.sintomas?.join(', ')}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={triagem?.classificacao} />
                    <p className="mt-2 font-semibold text-vittas-navy">Score {triagem?.scorePrioridade}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{atendimento.posicaoFila ? `${atendimento.posicaoFila}o` : '-'}</p>
                    <p className="text-slate-500">{atendimento.tempoEstimado || '-'} min</p>
                    <p className="text-slate-500">Check-in {formatarDataHora(atendimento.dataCheckin)}</p>
                    <p className="text-slate-500">Ultimo {formatarDataHora(paciente?.ultimoCheckin)}</p>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={atendimento.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-52 flex-wrap gap-2">
                      <button className="rounded-lg bg-blue-50 p-2 text-vittas-blue" onClick={() => executarAcao('Em atendimento', atendimento.id)} title="Iniciar atendimento" type="button">
                        <PlayCircle size={18} aria-hidden="true" />
                      </button>
                      <button className="rounded-lg bg-purple-50 p-2 text-purple-700" onClick={() => executarAcao('Encaminhado', atendimento.id)} title="Encaminhar para profissional" type="button">
                        <Send size={18} aria-hidden="true" />
                      </button>
                      <button className="rounded-lg bg-emerald-50 p-2 text-emerald-700" onClick={() => executarAcao('Finalizado', atendimento.id)} title="Finalizar atendimento" type="button">
                        <SquareCheckBig size={18} aria-hidden="true" />
                      </button>
                      <button className="rounded-lg bg-red-50 p-2 text-vittas-danger" onClick={() => executarAcao('Cancelado', atendimento.id)} title="Cancelar atendimento" type="button">
                        <XCircle size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!linhasFiltradas.length && (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan="7">
                    {carregando ? 'Carregando fila...' : 'Nenhum paciente encontrado para os filtros atuais.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PainelFuncionario;
