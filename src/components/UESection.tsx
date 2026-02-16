import { Minus, Plus } from 'lucide-react';
import { calcAvg, getGradeColor, type Grade } from '@/lib/helpers';
import type { ModuleConfig } from '@/lib/constants';

interface UESectionProps {
  title: string;
  ueKey: 'coef21' | 'coef22';
  modules: ModuleConfig[];
  gradesMap: Record<string, Grade[]>;
  absences: Record<string, number>;
  onModuleClick: (mod: ModuleConfig) => void;
  onAbsenceUpdate: (modId: string, delta: number) => void;
  avg: string | null;
}

const UESection = ({ title, ueKey, modules, gradesMap, absences, onModuleClick, onAbsenceUpdate, avg }: UESectionProps) => (
  <div className="space-y-3 mb-6">
    <div className="flex justify-between items-center bg-card-hover/50 p-3 rounded-xl border border-foreground/5">
      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">{title}</h3>
      <div className="font-mono font-bold bg-background/40 px-2 py-1 rounded text-sm">{avg ?? '—'}</div>
    </div>
    {modules.filter(m => m[ueKey] > 0).map(module => {
      const modAvg = calcAvg(gradesMap[module.id]);
      const absCount = absences[module.id] || 0;
      return (
        <div
          key={module.id}
          className="bg-card p-4 rounded-2xl flex justify-between items-center cursor-pointer border border-foreground/5 active:scale-95 transition-transform"
          onClick={() => onModuleClick(module)}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="font-bold text-base">{module.label}</div>
              <div className="text-xs text-muted-foreground flex gap-2 items-center mt-0.5">
                <span className="opacity-70">{module.short}</span>
                <span className="bg-foreground/10 px-1.5 rounded text-[9px] text-foreground/80">Coef {module[ueKey]}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className={`font-mono font-bold text-lg ${getGradeColor(modAvg)}`}>{modAvg || "—"}</div>
            <div className="flex items-center gap-1 bg-background/50 rounded-lg p-0.5 border border-foreground/5" onClick={e => e.stopPropagation()}>
              <button onClick={() => onAbsenceUpdate(module.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-foreground/10 rounded text-muted-foreground active:text-foreground active:bg-foreground/10">
                <Minus size={10} />
              </button>
              <span className={`text-[10px] font-bold w-4 text-center ${absCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>{absCount}</span>
              <button onClick={() => onAbsenceUpdate(module.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-foreground/10 rounded text-muted-foreground active:text-foreground active:bg-foreground/10">
                <Plus size={10} />
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default UESection;
