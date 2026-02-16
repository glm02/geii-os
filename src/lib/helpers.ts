import { MODULES_CONFIG_S2 } from './constants';

export interface Grade {
  id: string;
  value: string;
  coef: string;
  name: string;
}

export const calcAvg = (grades: Grade[] | undefined): string | null => {
  if (!grades || grades.length === 0) return null;
  let p = 0, c = 0;
  grades.forEach(g => {
    p += parseFloat(g.value) * parseFloat(g.coef);
    c += parseFloat(g.coef);
  });
  return c === 0 ? '0' : (p / c).toFixed(2);
};

export const getGradeColor = (val: string | null): string => {
  if (val === null || val === "—") return "text-muted-foreground";
  const v = parseFloat(val);
  if (v < 10) return "text-destructive";
  if (v < 12) return "text-warning";
  if (v < 14) return "text-primary";
  return "text-success";
};

export const getModuleName = (id: string): string => {
  const mod = MODULES_CONFIG_S2.find(m => m.id === id);
  return mod ? mod.label : id;
};
