export type ApplicationStatus =
  | "pendente"
  | "aceita"
  | "recusada"
  | "concluida";

export type Role = "student" | "institution" | "admin";

export type Opportunity = {
  id: string;
  title: string;
  institutionId: string;
  institutionName: string;
  category: string;
  city: string;
  workloadHours: number;
  description: string;
};

export type Application = {
  id: string;
  opportunityId: string;
  studentId: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type Student = {
  id: string;
  name: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "opp1",
    title: "Apoio escolar em reforço de matemática",
    institutionId: "inst1",
    institutionName: "Projeto Semeando Futuro",
    category: "Educação",
    city: "Quixadá",
    workloadHours: 40,
    description:
      "Auxiliar alunos do ensino básico com dificuldades em matemática, com encontros semanais supervisionados.",
  },
  {
    id: "opp2",
    title: "Mutirão de limpeza comunitária",
    institutionId: "inst1",
    institutionName: "Casa de Apoio Esperança",
    category: "Meio Ambiente",
    city: "Quixadá",
    workloadHours: 12,
    description: "Apoiar ações de limpeza e conscientização ambiental.",
  },
];

export const students: Student[] = [
  { id: "stu1", name: "Antônio Kleberson" },
  { id: "stu2", name: "Luís Gustavo" },
];

export const applications: Application[] = [
  {
    id: "app1",
    opportunityId: "opp1",
    studentId: "stu1",
    status: "pendente",
    createdAt: "2026-01-10",
  },
  {
    id: "app2",
    opportunityId: "opp2",
    studentId: "stu1",
    status: "aceita",
    createdAt: "2026-01-08",
  },
  {
    id: "app3",
    opportunityId: "opp1",
    studentId: "stu2",
    status: "recusada",
    createdAt: "2026-01-09",
  },
];

export function getOpportunityById(id: string) {
  return opportunities.find((o) => o.id === id);
}

export function getApplicationsWithDetailsByStudent(studentId: string) {
  return applications
    .filter((a) => a.studentId === studentId)
    .map((a) => ({
      ...a,
      opportunity: getOpportunityById(a.opportunityId)!,
    }));
}

export function getApplicationsWithDetailsByOpportunity(opportunityId: string) {
  return applications
    .filter((a) => a.opportunityId === opportunityId)
    .map((a) => ({
      ...a,
      student: students.find((s) => s.id === a.studentId)!,
    }));
}
