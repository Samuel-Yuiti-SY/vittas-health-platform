import { Link, NavLink } from 'react-router-dom';

import Button from './Button.jsx';
import LogoVittas from './LogoVittas.jsx';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/#como-funciona', label: 'Como funciona' },
  { to: '/#servicos', label: 'Servicos' },
  { to: '/#unidades', label: 'Unidades' },
];

function InstitutionalHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-vittas-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
        <Link aria-label="VITTAS inicio" to="/">
          <LogoVittas />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <NavLink
              className="rounded-lg px-3 py-2 text-sm font-semibold text-vittas-muted transition hover:bg-vittas-slate hover:text-vittas-navy"
              key={item.label}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link className="hidden text-sm font-semibold text-vittas-navy sm:inline" to="/cadastro">
            Cadastrar paciente
          </Link>
          <Button className="min-h-10 px-3" to="/login">
            Entrar
          </Button>
        </div>
      </div>
    </header>
  );
}

export default InstitutionalHeader;
