import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-surface-line bg-surface-muted">
      <div className="container-jale grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-body-sm text-ink-muted">
            Marketplace peruano que conecta talento universitario verificado con MYPES. El pago
            queda retenido hasta que apruebes el trabajo.
          </p>
        </div>
        <div>
          <p className="mb-3 font-display text-body-sm font-bold">Para estudiantes</p>
          <ul className="space-y-2 text-body-sm text-ink-muted">
            <li>
              <Link to="/onboarding" className="hover:text-primary">
                Crear perfil
              </Link>
            </li>
            <li>
              <Link to="/onboarding/estudiante/verificacion" className="hover:text-primary">
                Verificación
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-display text-body-sm font-bold">Para clientes</p>
          <ul className="space-y-2 text-body-sm text-ink-muted">
            <li>
              <Link to="/explorar" className="hover:text-primary">
                Explorar talento
              </Link>
            </li>
            <li>
              <a href="/#como-funciona" className="hover:text-primary">
                Cómo funciona el escrow
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-display text-body-sm font-bold">Confianza</p>
          <ul className="space-y-2 text-body-sm text-ink-muted">
            <li>Escrow hasta aprobación</li>
            <li>Carné universitario verificado</li>
            <li>Hecho en Perú</li>
          </ul>
        </div>
      </div>
      <div className="container-jale border-t border-surface-line py-5 text-caption text-ink-faint">
        © {new Date().getFullYear()} Jale.pe · Prototipo de diseño
      </div>
    </footer>
  );
}
