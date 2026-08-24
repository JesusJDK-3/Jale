import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Field, Input, Select } from "../components/Field";
import { Stepper } from "../components/Stepper";
import { CAREERS, STUDENT_STEPS, UNIVERSITIES } from "../data";
import { useAppState } from "../state";

export function StudentRegisterPage() {
  const navigate = useNavigate();
  const { student, setStudent } = useAppState();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/onboarding/estudiante/carne");
  }

  const complete =
    student.nombre && student.correo && student.universidad && student.carrera && student.semestre;

  return (
    <div className="container-jale max-w-xl py-10 lg:py-16">
      <Stepper steps={STUDENT_STEPS} current={2} />
      <h1 className="mt-8 font-display text-display-md">Cuéntanos quién eres</h1>
      <p className="mt-2 text-body text-ink-muted">
        Estos datos salen en tu perfil público. Usamos el correo solo para avisarte de la
        verificación.
      </p>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <Field label="Nombre completo">
          <Input
            required
            value={student.nombre}
            onChange={(e) => setStudent({ nombre: e.target.value })}
            placeholder="Camila Rojas"
          />
        </Field>
        <Field label="Correo" hint="Mejor tu correo personal o institucional.">
          <Input
            required
            type="email"
            value={student.correo}
            onChange={(e) => setStudent({ correo: e.target.value })}
            placeholder="camila@correo.com"
          />
        </Field>
        <Field label="Universidad">
          <Select
            required
            value={student.universidad}
            onChange={(e) => setStudent({ universidad: e.target.value })}
          >
            <option value="">Selecciona</option>
            {UNIVERSITIES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Carrera">
          <Select
            required
            value={student.carrera}
            onChange={(e) => setStudent({ carrera: e.target.value })}
          >
            <option value="">Selecciona</option>
            {CAREERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Semestre actual" hint="Si ya egresaste, elige “Egresado/a”.">
          <Select
            required
            value={student.semestre}
            onChange={(e) => setStudent({ semestre: e.target.value })}
          >
            <option value="">Selecciona</option>
            {Array.from({ length: 12 }, (_, i) => `${i + 1}.º semestre`).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Egresado/a">Egresado/a (hasta 2 años)</option>
          </Select>
        </Field>
        <Button type="submit" fullWidth size="lg" disabled={!complete}>
          Continuar
        </Button>
      </form>
    </div>
  );
}
