import LogoVittas from './LogoVittas.jsx';

function PublicFooter() {
  return (
    <footer className="border-t border-vittas-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-[1fr_1.2fr] md:items-center">
        <LogoVittas size="sm" />
        <div className="grid gap-2 text-sm leading-6 text-vittas-muted sm:grid-cols-3">
          <p>MVP academico com dados simulados.</p>
          <p>Fluxo inspirado em UBS, UPA e gestao publica de saude.</p>
          <p>Em emergencia, ligue 192.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
