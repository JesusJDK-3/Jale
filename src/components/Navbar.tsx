import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./Button";

const links = [
  { to: "/explorar", label: "Explorar" },
  { to: "/#categorias", label: "Categorías" },
  { to: "/#como-funciona", label: "Cómo funciona" },
  { to: "/sistema-de-diseno", label: "Sistema" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line/80 bg-white/90 backdrop-blur-md">
      <div className="container-jale flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {links.map((link) =>
            link.to.startsWith("/#") ? (
              <a
                key={link.to}
                href={link.to}
                className="text-body-sm font-medium text-ink-muted hover:text-ink"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "text-body-sm font-medium",
                    isActive ? "text-primary" : "text-ink-muted hover:text-ink",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="tertiary" size="sm" onClick={() => navigate("/onboarding")}>
            Soy estudiante
          </Button>
          <Button size="sm" onClick={() => navigate("/explorar")}>
            Busco un servicio
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-surface-line lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-4 bg-ink" />
            <span className="block h-0.5 w-4 bg-ink" />
            <span className="block h-0.5 w-4 bg-ink" />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-line bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Móvil">
            {links.map((link) =>
              link.to.startsWith("/#") ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setOpen(false)}
                  className="py-1 text-body font-medium text-ink"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="py-1 text-body font-medium text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Button fullWidth className="mt-2" onClick={() => navigate("/onboarding")}>
              Soy estudiante
            </Button>
            <Button variant="tertiary" fullWidth onClick={() => navigate("/explorar")}>
              Busco un servicio
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
