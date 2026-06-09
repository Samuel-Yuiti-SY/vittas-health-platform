function PageHeader({ actions, description, eyebrow, title }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-sm font-bold uppercase tracking-normal text-vittas-green">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-vittas-navy sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base leading-7 text-vittas-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>}
    </div>
  );
}

export default PageHeader;
