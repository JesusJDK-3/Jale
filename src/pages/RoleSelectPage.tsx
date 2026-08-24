import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Stepper } from "../components/Stepper";
import { STUDENT_STEPS } from "../data";
import { useAppState } from "../state";

export function RoleSelectPage() {
  const navigate = useNavigate();
  const { setRole } = useAppState();

  return (
    <div className="container-jale max-w-3xl py-10 lg:py-16">
      <Stepper steps={STUDENT_STEPS} current={1} />
      <h1 className="mt-8 font-display text-display-md">¿Cómo vas a usar Jale.pe?</h1>
      <p className="mt-2 text-body text-ink-muted">
        Eliges una vez. Si buscas un servicio, puedes explorar ahora y registrarte después.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setRole("estudiante");
            navigate("/onboarding/estudiante");
          }}
          className="rounded-lg border border-surface-line bg-white p-6 text-left shadow-xs transition hover:border-primary hover:shadow-md"
        >
          <p className="font-display text-title">Soy estudiante</p>
          <p className="mt-2 text-body-sm text-ink-muted">
            Perfil con universidad, carrera y carné. Te verificamos en 24–48 h y sales con badge
            de estudiante activo.
          </p>
          <p className="mt-4 text-body-sm font-semibold text-primary">Crear perfil →</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("cliente");
            navigate("/explorar");
          }}
          className="rounded-lg border border-surface-line bg-white p-6 text-left shadow-xs transition hover:border-secondary hover:shadow-md"
        >
          <p className="font-display text-title">Busco un servicio</p>
          <p className="mt-2 text-body-sm text-ink-muted">
            Mira perfiles y precios sin cuenta. Solo te pedimos datos cuando quieras contactar a
            alguien.
          </p>
          <p className="mt-4 text-body-sm font-semibold text-secondary">Explorar talento →</p>
        </button>
      </div>

      <div className="mt-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
