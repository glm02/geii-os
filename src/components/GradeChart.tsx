import { MODULES_CONFIG_S2 } from '@/lib/constants';
import { calcAvg, type Grade } from '@/lib/helpers';

interface GradeChartProps {
  gradesMap: Record<string, Grade[]>;
}

const GradeChart = ({ gradesMap }: GradeChartProps) => {
  const data = MODULES_CONFIG_S2
    .map(m => ({ short: m.short, avg: parseFloat(calcAvg(gradesMap[m.id]) || '0') }))
    .filter(d => d.avg > 0);

  if (data.length === 0) {
    return (
      <div className="fintech-card p-5 border border-foreground/5 text-center">
        <p className="text-xs text-muted-foreground py-4">Ajoute des notes pour voir le graphique 📊</p>
      </div>
    );
  }

  const max = 20;

  return (
    <div className="fintech-card p-5 border border-foreground/5">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Aperçu Notes</h3>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d, i) => {
          const h = (d.avg / max) * 100;
          const color = d.avg < 10 ? 'bg-destructive' : d.avg < 12 ? 'bg-warning' : d.avg < 14 ? 'bg-primary' : 'bg-success';
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono font-bold text-muted-foreground">{d.avg.toFixed(1)}</span>
              <div
                className={`w-full rounded-t-md ${color} transition-all duration-500 min-h-[4px]`}
                style={{ height: `${h}%` }}
              />
              <span className="text-[7px] font-bold text-muted-foreground truncate w-full text-center">{d.short}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-[1px] bg-foreground/10" />
      <div className="flex justify-between text-[8px] text-muted-foreground/50 mt-1">
        <span>0</span>
        <span>10</span>
        <span>20</span>
      </div>
    </div>
  );
};

export default GradeChart;
