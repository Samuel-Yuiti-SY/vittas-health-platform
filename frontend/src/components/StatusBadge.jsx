const styles = {
  'Baixa prioridade': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Media prioridade': 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  'Alta prioridade': 'bg-orange-50 text-orange-700 ring-orange-200',
  Emergencia: 'bg-red-50 text-red-700 ring-red-200',
  Aguardando: 'bg-blue-50 text-blue-700 ring-blue-200',
  Chamado: 'bg-vittas-mint text-vittas-navy ring-emerald-200',
  'Em atendimento': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Encaminhado: 'bg-purple-50 text-purple-700 ring-purple-200',
  Finalizado: 'bg-slate-100 text-slate-700 ring-slate-200',
  Cancelado: 'bg-red-50 text-red-700 ring-red-200',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status] || styles.Finalizado}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
