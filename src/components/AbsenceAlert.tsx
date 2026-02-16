import { AlertTriangle } from 'lucide-react';
import { MODULES_CONFIG_S2 } from '@/lib/constants';

interface AbsenceAlertProps {
  absences: Record<string, number>;
}

const AbsenceAlert = ({ absences }: AbsenceAlertProps) => {
  const warnings = MODULES_CONFIG_S2
    .filter(m => (absences[m.id] || 0) >= 3)
    .map(m => ({ label: m.label, count: absences[m.id] }));

  if (warnings.length === 0) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-1">Attention Absences</p>
        {warnings.map((w, i) => (
          <p key={i} className="text-xs text-foreground/80">
            <span className="font-bold">{w.label}</span> : {w.count} absences
          </p>
        ))}
      </div>
    </div>
  );
};

export default AbsenceAlert;
