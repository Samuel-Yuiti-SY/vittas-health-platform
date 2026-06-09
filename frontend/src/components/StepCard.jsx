function StepCard({ description, number, title }) {
  return (
    <div className="flex gap-4 rounded-lg border border-vittas-border bg-white p-5 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vittas-green text-sm font-extrabold text-white">
        {number}
      </span>
      <div>
        <h3 className="font-bold text-vittas-navy">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-vittas-muted">{description}</p>
      </div>
    </div>
  );
}

export default StepCard;
