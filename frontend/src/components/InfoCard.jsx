const toneClasses = {
  blue: 'bg-vittas-blueSoft text-vittas-blue',
  green: 'bg-vittas-mint text-vittas-greenDark',
  yellow: 'bg-vittas-warningSoft text-yellow-800',
  red: 'bg-vittas-dangerSoft text-vittas-danger',
  slate: 'bg-vittas-slate text-vittas-navy',
};

function InfoCard({ helper, icon: Icon, label, tone = 'blue', value }) {
  return (
    <div className="rounded-lg border border-vittas-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-vittas-muted">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-vittas-navy">{value}</p>
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[tone] || toneClasses.blue}`}>
            <Icon size={20} aria-hidden="true" />
          </span>
        )}
      </div>
      {helper && <p className="mt-3 text-xs font-semibold leading-5 text-vittas-muted">{helper}</p>}
    </div>
  );
}

export default InfoCard;
