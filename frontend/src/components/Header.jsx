import { UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import LogoVittas from './LogoVittas.jsx';
import { obterUsuario, removerUsuario } from '../utils/auth.js';

function Header() {
  const location = useLocation();
  const usuario = obterUsuario();

  function sair() {
    removerUsuario();
    localStorage.removeItem('vittas_paciente_id');
    window.location.href = '/login';
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link className="flex items-center gap-2" to="/">
          <LogoVittas size="sm" />
        </Link>

        <div className="flex items-center gap-2 text-sm text-vittas-text">
          {usuario ? (
            <>
              <span className="hidden max-w-44 truncate sm:inline">{usuario.nome}</span>
              <button className="text-xs font-semibold text-vittas-blue" onClick={sair} type="button">
                Sair
              </button>
            </>
          ) : (
            <Link className={location.pathname === '/login' ? 'font-semibold text-vittas-blue' : ''} to="/login">
              Entrar
            </Link>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vittas-blueSoft text-vittas-navy">
            <UserRound size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
