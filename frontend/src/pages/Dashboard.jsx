import { useEffect, useMemo, useState } from 'react';
import { Activity, Clock, Hospital, Users } from 'lucide-react';

import { listarAtendimentos, obterDashboard } from '../api/api.js';
import AdminLayout from '../components/AdminLayout.jsx';
import Card from '../components/Card.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatarDataHora } from '../utils/formatters.js';

function Barra({ label, value, total }) {
  const largura = total ? Math.max((value / total) * 100, 6) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-sm">
        <span className="font-semibold text-vittas-navy">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-vittas-blue" style={{ width: `${largura}%` }} />
      </div>
    </div>
  );
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const [dashboardResp, atendimentosResp] = await Promise.all([obterDashboard(), listarAtendimentos()]);
        setDashboard(dashboardResp.data);
        setAtendimentos(atendimentosResp.data);
      } catch (error) {
        setErro(error.response?.data?.detail || 'Nao foi possivel carregar o dashboard.');
      }
    }
    carregar();
  }, []);

  const totalPrioridades = useMemo(
    () => Object.values(dashboard?.pacientesPorPrioridade || {}).reduce((soma, valor) => soma + valor, 0),
    [dashboard],
  );
  const totalUnidades = useMemo(
    () => Object.values(dashboard?.pacientesPorUnidade || {}).reduce((soma, valor) => soma + valor, 0),
    [dashboard],
  );
  const totalStatus = useMemo(
    () => Object.values(dashboard?.atendimentosPorStatus || {}).reduce((soma, valor) => soma + valor, 0),
    [dashboard],
  );

  if (erro) {
    return <div className="mx-auto max-w-xl px-4 py-8"><Card><p className="text-vittas-danger">{erro}</p></Card></div>;
  }

  return (
    <AdminLayout
      description="Indicadores simulados para demonstracao academica da operacao VITTAS."
      eyebrow="Administracao"
      title="Dashboard VITTAS"
    >
      <Card className="mb-5 bg-vittas-warningSoft">
        <p className="text-sm font-semibold leading-6 text-yellow-900">
          Todos os indicadores abaixo usam dados simulados. O dashboard demonstra fluxo, prioridade e demanda por unidade.
        </p>
      </Card>

      <h2 className="mb-3 text-xl font-bold text-vittas-navy">Indicadores gerais</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Pacientes aguardando" value={dashboard?.totalPacientesAguardando ?? '-'} helper="Fila ativa no momento" />
        <DashboardCard label="Concluidos hoje" value={dashboard?.totalAtendimentosConcluidosHoje ?? '-'} helper="Atendimentos finalizados" tone="green" />
        <DashboardCard label="Tempo medio" value={`${dashboard?.tempoMedioEspera ?? '-'} min`} helper="Espera media simulada" tone="yellow" />
        <DashboardCard label="Emergencias" value={dashboard?.numeroCasosEmergencia ?? '-'} helper="Casos com alerta 192" tone="red" />
        <DashboardCard label="Casos prioritarios" value={dashboard?.numeroCasosPrioritarios ?? '-'} helper="Alta prioridade registrada" tone="yellow" />
        <DashboardCard label="Maior demanda" value={dashboard?.unidadeMaiorDemanda || '-'} helper="Unidade com mais pacientes ativos" />
        <DashboardCard label="Encaminhados" value={dashboard?.pacientesEncaminhados ?? '-'} helper="Pacientes no painel profissional" />
        <DashboardCard label="Finalizados" value={dashboard?.pacientesFinalizados ?? '-'} helper="Atendimentos concluidos" tone="green" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-vittas-navy">
            <Activity size={20} aria-hidden="true" />
            Prioridades
          </h2>
          <div className="space-y-3">
            {Object.entries(dashboard?.pacientesPorPrioridade || {}).map(([label, value]) => (
              <Barra key={label} label={label} total={totalPrioridades} value={value} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-vittas-navy">
            <Hospital size={20} aria-hidden="true" />
            Unidades com maior demanda
          </h2>
          <p className="mb-4 rounded-lg bg-vittas-mint px-3 py-2 text-sm font-semibold text-vittas-navy">
            Maior demanda: {dashboard?.unidadeMaiorDemanda || 'Sem dados'}
          </p>
          <div className="space-y-3">
            {Object.entries(dashboard?.pacientesPorUnidade || {}).map(([label, value]) => (
              <Barra key={label} label={label} total={totalUnidades} value={value} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-vittas-navy">
            <Users size={20} aria-hidden="true" />
            Status dos atendimentos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm font-medium text-vittas-blue">Encaminhados</p>
              <p className="mt-2 text-2xl font-bold text-vittas-navy">{dashboard?.pacientesEncaminhados ?? '-'}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-sm font-medium text-vittas-green">Finalizados</p>
              <p className="mt-2 text-2xl font-bold text-vittas-navy">{dashboard?.pacientesFinalizados ?? '-'}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {Object.entries(dashboard?.atendimentosPorStatus || {}).map(([label, value]) => (
              <Barra key={label} label={label} total={totalStatus} value={value} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-vittas-navy">
            <Clock size={20} aria-hidden="true" />
            Atendimentos recentes
          </h2>
          <div className="space-y-3">
            {(dashboard?.atendimentosRecentes || []).map((item) => (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3" key={item.id}>
                <div>
                  <p className="font-semibold text-vittas-navy">{item.paciente}</p>
                  <p className="text-sm text-slate-500">{item.unidade} - {formatarDataHora(item.dataCheckin)}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-bold text-vittas-navy">Atendimentos por tipo</h2>
          <div className="space-y-3">
            {Object.entries(dashboard?.atendimentosPorTipo || {}).map(([label, value]) => (
              <Barra key={label} label={label} total={atendimentos.length} value={value} />
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
