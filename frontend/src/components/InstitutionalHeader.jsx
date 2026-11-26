import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "./Button.jsx";
import LogoVittas from "./LogoVittas.jsx";

const links = [
  { to: "/", label: "Início" },
  { to: "/#como-funciona", label: "Como funciona" },
  { to: "/#servicos", label: "Recursos" },
  { to: "/#unidades", label: "Unidades" },
];
export default function InstitutionalHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="health-header">
      <a className="health-skip" href="#conteudo-principal">
        Ir para o conteúdo
      </a>
      <div className="health-container health-header-inner">
        <Link aria-label="VITTAS Saúde pública digital, início" to="/">
          <LogoVittas />
        </Link>
        <nav className="health-desktop-nav" aria-label="Navegação principal">
          {links.map((item) => (
            <a key={item.label} href={item.to}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="health-header-actions">
          <Button to="/login">Entrar</Button>
          <button
            className="health-menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="health-mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={21} aria-hidden />
            ) : (
              <Menu size={21} aria-hidden />
            )}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="health-mobile-nav"
          className="health-mobile-nav"
          aria-label="Navegação móvel"
        >
          {links.map((item) => (
            <a key={item.label} href={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <Link to="/cadastro" onClick={() => setOpen(false)}>
            Cadastrar paciente
          </Link>
        </nav>
      )}
    </header>
  );
}
