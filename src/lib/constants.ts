export const DEFAULT_ADE = "https://edt.univ-lyon1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=13655&projectId=1&calType=ical&firstDate=2025-08-18&lastDate=2026-08-01";

export const LINKS = {
  ADE: "https://edt.univ-lyon1.fr/direct/index.jsp",
  MAIL: "https://mail.univ-lyon1.fr/owa",
  DOCS: "https://wwwgeii.univ-lyon1.fr/depot_certif",
  MOODLE: "https://moodle.univ-lyon1.fr/",
  MIRE: "https://wwwgeii.univ-lyon1.fr/mire_geii.php",
  CROUS: "https://www.crous-lyon.fr/restaurant/restaurant-iut-gratte-ciel/",
  TCL: "https://www.tcl.fr/se-deplacer/info-trafic"
};

export const USEFUL_LINKS = [
  { name: 'Moodle', url: LINKS.MOODLE, color: 'bg-orange-500', icon: 'GraduationCap' as const },
  { name: 'Mire GEII', url: LINKS.MIRE, color: 'bg-emerald-500', icon: 'FileText' as const },
  { name: 'ADE Direct', url: LINKS.ADE, color: 'bg-indigo-500', icon: 'Calendar' as const },
  { name: 'Mail Univ', url: LINKS.MAIL, color: 'bg-sky-500', icon: 'Mail' as const },
  { name: 'Justificatifs', url: LINKS.DOCS, color: 'bg-purple-500', icon: 'Paperclip' as const },
  { name: 'Info Trafic TCL', url: LINKS.TCL, color: 'bg-red-500', icon: 'Train' as const }
];

export interface ModuleConfig {
  id: string;
  short: string;
  label: string;
  coef21: number;
  coef22: number;
  cat: string;
}

export const MODULES_CONFIG_S2: ModuleConfig[] = [
  { id: 'R2.01', short: 'AN2', label: 'Analyse', coef21: 1.1, coef22: 0, cat: 'Fonda' },
  { id: 'R2.02', short: 'CC2', label: 'Culture Com', coef21: 1.1, coef22: 0, cat: 'Trans' },
  { id: 'R2.03', short: 'VE2', label: 'Vie Entr.', coef21: 0.8, coef22: 0, cat: 'Trans' },
  { id: 'R2.04', short: 'OML2', label: 'Outils Maths', coef21: 2.6, coef22: 0, cat: 'Fonda' },
  { id: 'R2.05', short: 'PPP2', label: 'Projet Pro', coef21: 0.8, coef22: 0.2, cat: 'Trans' },
  { id: 'R2.06', short: 'AUTO2', label: 'Automatisme', coef21: 0, coef22: 2.6, cat: 'Tech' },
  { id: 'R2.07', short: 'INFO2', label: 'Info Indus', coef21: 0, coef22: 2.6, cat: 'Tech' },
  { id: 'R2.08', short: 'ELEN2', label: 'Élec/Énergie', coef21: 1.3, coef22: 1.3, cat: 'Tech' },
  { id: 'R2.09', short: 'ENER2', label: 'Énergie', coef21: 1.3, coef22: 1.3, cat: 'Tech' },
  { id: 'R2.10', short: 'PApp2', label: 'Physique App', coef21: 0, coef22: 1.0, cat: 'Fonda' },
  { id: 'S2.1', short: 'SAÉ 2.1', label: 'SAÉ CAPA', coef21: 2.5, coef22: 2.5, cat: 'SAÉ' },
  { id: 'S2.2', short: 'SAÉ 2.2', label: 'SAÉ Robot', coef21: 2.5, coef22: 2.5, cat: 'SAÉ' },
  { id: 'PF2', short: 'PORTF', label: 'Portfolio S2', coef21: 1.0, coef22: 1.0, cat: 'SAÉ' },
];

export interface TaskData {
  module: string;
  title: string;
  end: string;
  type: string;
}

const baseTasks: TaskData[] = [
  { module: 'R2.09', title: 'QCM_TD1', end: '2026-02-13', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD2', end: '2026-03-04', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD3', end: '2026-03-06', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD4', end: '2026-03-13', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD6', end: '2026-03-27', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD8', end: '2026-04-24', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD9', end: '2026-04-30', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD11', end: '2026-05-08', type: 'QCM' },
  { module: 'R2.09', title: 'QCM_TD12', end: '2026-05-21', type: 'QCM' },
  { module: 'R2.10', title: 'QCM1_Séance 1', end: '2026-02-06', type: 'QCM' },
  { module: 'R2.10', title: 'QCM2_Séance 2', end: '2026-02-13', type: 'QCM' },
  { module: 'R2.10', title: 'QCM3 - Devoir', end: '2026-02-27', type: 'DEVOIR' },
  { module: 'R2.10', title: 'QCM4', end: '2026-03-06', type: 'QCM' },
  { module: 'R2.10', title: 'QCM5', end: '2026-03-13', type: 'QCM' },
  { module: 'R2.10', title: 'QCM6', end: '2026-03-20', type: 'QCM' },
  { module: 'R2.10', title: 'QCM7', end: '2026-03-28', type: 'QCM' },
  { module: 'R2.10', title: 'QCM8', end: '2026-04-04', type: 'QCM' },
  { module: 'R2.10', title: 'QCM10', end: '2026-04-18', type: 'QCM' },
  { module: 'R2.10', title: 'QCM11', end: '2026-05-09', type: 'QCM' },
  { module: 'R2.10', title: 'QCM12', end: '2026-05-16', type: 'QCM' },
  { module: 'R2.10', title: 'QCM13', end: '2026-05-23', type: 'QCM' },
  { module: 'R2.10', title: 'QCM14', end: '2026-05-30', type: 'QCM' },
];

// Generate math QCMs
const startDate = new Date('2026-02-02');
for (let i = 0; i < 10; i++) {
  const d1 = new Date(startDate);
  d1.setDate(startDate.getDate() + (i * 7));
  const d2 = new Date(startDate);
  d2.setDate(startDate.getDate() + (i * 7) + 3);
  baseTasks.push({ module: 'R2.04', title: `QCM Hebdo ${i + 1}.1`, end: d1.toISOString().split('T')[0], type: 'MATHS' });
  baseTasks.push({ module: 'R2.04', title: `QCM Hebdo ${i + 1}.2`, end: d2.toISOString().split('T')[0], type: 'MATHS' });
}

export const TASKS_DATA = baseTasks;
