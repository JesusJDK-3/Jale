import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "estudiante" | "cliente" | null;

export type StudentDraft = {
  nombre: string;
  correo: string;
  universidad: string;
  carrera: string;
  semestre: string;
  documentoNombre: string;
};

type AppState = {
  role: Role;
  setRole: (role: Role) => void;
  student: StudentDraft;
  setStudent: (patch: Partial<StudentDraft>) => void;
  clientName: string;
  setClientName: (name: string) => void;
  savedIds: string[];
  toggleSaved: (id: string) => boolean;
};

const emptyStudent: StudentDraft = {
  nombre: "",
  correo: "",
  universidad: "",
  carrera: "",
  semestre: "",
  documentoNombre: "",
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [student, setStudentState] = useState<StudentDraft>(emptyStudent);
  const [clientName, setClientName] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      student,
      setStudent: (patch: Partial<StudentDraft>) =>
        setStudentState((prev) => ({ ...prev, ...patch })),
      clientName,
      setClientName,
      savedIds,
      toggleSaved: (id: string) => {
        const exists = savedIds.includes(id);
        setSavedIds((prev) => (exists ? prev.filter((x) => x !== id) : [...prev, id]));
        return !exists;
      },
    }),
    [role, student, clientName, savedIds],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
