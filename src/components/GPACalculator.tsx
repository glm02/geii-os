import { TrendingUp } from 'lucide-react';

interface GPACalculatorProps {
  currentAvg: string | null;
  history: Record<string, Record<string, string>>;
}

const GPACalculator = ({ currentAvg, history }: GPACalculatorProps) => {
  const semesters: { label: string; avg: number | null }[] = [];
  
  for (let s = 1; s <= 4; s++) {
    const key = `s${s}`;
    const ue1 = history[key]?.[`ue${s}1`];
    const ue2 = history[key]?.[`ue${s}2`];
    if (ue1 && ue2) {
      semesters.push({ label: `S${s}`, avg: (parseFloat(ue1) + parseFloat(ue2)) / 2 });
    } else if (s === 2 && currentAvg) {
      semesters.push({ label: `S2`, avg: parseFloat(currentAvg) });
    }
  }

  if (semesters.length === 0) return null;

  const globalGPA = semesters.reduce((s, v) => s + (v.avg || 0), 0) / semesters.length;

  return (
    <div className="fintech-card p-5 border border-foreground/5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={14} /> Moyenne Globale
        </h3>
        <span className="text-lg font-bold font-mono text-primary">{globalGPA.toFixed(2)}</span>
      </div>
      <div className="flex gap-2">
        {semesters.map((s, i) => (
          <div key={i} className="flex-1 bg-foreground/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-muted-foreground font-bold">{s.label}</div>
            <div className="font-mono font-bold text-sm mt-1">{s.avg?.toFixed(2) || '--'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GPACalculator;
