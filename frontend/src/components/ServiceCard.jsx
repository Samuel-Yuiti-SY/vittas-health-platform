function ServiceCard({ description, icon: Icon, title }) {
  return (
    <div className="rounded-lg border border-vittas-border bg-white p-5 shadow-sm transition hover:border-vittas-blue hover:shadow-md">
      {Icon && (
        <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-vittas-blueSoft text-vittas-blue">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      <h3 className="text-lg font-bold text-vittas-navy">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-vittas-muted">{description}</p>
    </div>
  );
}

export default ServiceCard;
