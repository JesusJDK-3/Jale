import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { useAppState } from "../state";

export function StudentProfilePage() {
  const navigate = useNavigate();
  const { student } = useAppState();
  const uni = student.universidad || "UTP";
  const name = student.nombre || "Camila Rojas";
  const career = student.carrera || "Diseño gráfico";
  const semester = student.semestre || "7.º semestre";

  return (
    <div className="container-jale max-w-2xl py-10 lg:py-16">
      <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-body-sm text-success-hover">
        Perfil creado. El badge de estudiante activo se activa al cerrar la verificación.
      </div>

      <article className="mt-6 overflow-hidden rounded-xl border border-surface-line bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-primary to-primary-hover" />
        <div className="px-6 pb-8">
          <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-lg bg-white font-display text-title text-primary shadow-md">
            {name
              .split(" ")
              .slice(0, 2)
              .map((p) => p[0])
              .join("")}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-display-md">{name}</h1>
            <Badge tone="success" dot>
              Estudiante activo — {uni}
            </Badge>
            <Badge>No colegiado</Badge>
          </div>
          <p className="mt-1 text-body text-ink-muted">
            {career} · {semester}
          </p>
          <p className="mt-4 text-body text-ink">
            Listo para una mini-sustentación: te explico el criterio, te muestro alternativas y
            dejo archivos editables.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/explorar")}>Ver cómo te verán los clientes</Button>
            <Button variant="tertiary" onClick={() => navigate("/")}>
              Ir al inicio
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
