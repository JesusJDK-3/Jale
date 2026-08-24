import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Stepper } from "../components/Stepper";
import { STUDENT_STEPS } from "../data";
import { useAppState } from "../state";

export function StudentPendingPage() {
  const navigate = useNavigate();
  const { student } = useAppState();

  return (
    <div className="container-jale max-w-xl py-10 lg:py-16">
      <Stepper steps={STUDENT_STEPS} current={4} />
      <div className="mt-8 rounded-xl border border-surface-line bg-white p-6 sm:p-8">
        <Badge tone="warning" dot>
          En verificación (24–48 h)
        </Badge>
        <h1 className="mt-4 font-display text-display-md">Estamos revisando tu carné</h1>
        <p className="mt-2 text-body text-ink-muted">
          Un humano confirma que {student.nombre || "tu nombre"} estudia en{" "}
          {student.universidad || "tu universidad"}. Te escribimos a {student.correo || "tu correo"}{" "}
          cuando el badge esté listo.
        </p>
        <div className="mt-6 rounded-lg bg-surface-muted p-4 text-body-sm text-ink-muted">
          <p className="font-medium text-ink">Mientras tanto</p>
          <p className="mt-1">
            Tu perfil aún no aparece en búsquedas. Puedes ver cómo se verá cuando lo aprueben.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/onboarding/estudiante/perfil")}>
            Ver vista previa del perfil
          </Button>
          <Button variant="tertiary" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
