import { Home, LayoutDashboard, MessageCircle, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/pre-triagem', label: 'Vitti', icon: MessageCircle },
  { to: '/cadastro', label: 'Cadastro', icon: UserPlus },
  { to: '/dashboard', label: 'Painel', icon: LayoutDashboard },
];

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-2 pt-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition ${
                isActive ? 'bg-vittas-blueSoft text-vittas-navy' : 'text-slate-500'
              }`
            }
            key={to}
            to={to}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
