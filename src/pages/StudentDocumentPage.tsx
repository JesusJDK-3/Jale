import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FileDrop } from "../components/FileDrop";
import { Stepper } from "../components/Stepper";
import { STUDENT_STEPS } from "../data";
import { useAppState } from "../state";

export function StudentDocumentPage() {
  const navigate = useNavigate();
  const { student, setStudent } = useAppState();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!student.documentoNombre) return;
    navigate("/onboarding/estudiante/verificacion");
  }

  return (
    <div className="container-jale max-w-xl py-10 lg:py-16">
      <Stepper steps={STUDENT_STEPS} current={3} />
      <h1 className="mt-8 font-display text-display-md">Verifica que estudias</h1>
      <p className="mt-2 text-body text-ink-muted">
        Sube tu carné universitario o una constancia de matrícula vigente. Lo revisamos a mano para
        que el badge “Estudiante activo” signifique algo.
      </p>

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <FileDrop
          label="Carné o constancia"
          hint="JPG, PNG o PDF · máximo 8 MB · oculta el código de barras si quieres"
          fileName={student.documentoNombre}
          onFile={(file) => setStudent({ documentoNombre: file.name })}
        />
        <ul className="list-disc space-y-1 pl-5 text-body-sm text-ink-muted">
          <li>Debe verse nombre, universidad y periodo actual.</li>
          <li>No publicamos el documento. Solo el resultado de la revisión.</li>
        </ul>
        <Button type="submit" fullWidth size="lg" disabled={!student.documentoNombre}>
          Enviar a verificación
        </Button>
      </form>
    </div>
  );
}
