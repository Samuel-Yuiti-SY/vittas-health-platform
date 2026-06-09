function DashboardCard({ label, value, helper, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-vittas-blue',
    green: 'bg-emerald-50 text-vittas-green',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-vittas-danger',
  };

  return (
    <div className="rounded-lg border border-vittas-border bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-vittas-muted">{label}</p>
      <p className={`mt-3 inline-flex max-w-full break-words rounded-lg px-3 py-2 text-2xl font-bold leading-tight ${tones[tone] || tones.blue}`}>
        {value}
      </p>
      {helper && <p className="mt-3 text-sm leading-6 text-vittas-muted">{helper}</p>}
    </div>
  );
}

export default DashboardCard;
