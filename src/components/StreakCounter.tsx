import { Flame } from 'lucide-react';
import { TASKS_DATA } from '@/lib/constants';

interface StreakCounterProps {
  taskStatus: Record<string, boolean>;
}

const StreakCounter = ({ taskStatus }: StreakCounterProps) => {
  const total = TASKS_DATA.length;
  const done = TASKS_DATA.filter(t => taskStatus[t.title + t.module]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="fintech-card p-4 border border-foreground/5 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">QCMs</span>
        <Flame size={18} className={`${pct > 50 ? 'text-orange-400' : 'text-muted-foreground'}`} />
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tighter">{done}<span className="text-lg text-muted-foreground">/{total}</span></div>
        <div className="w-full bg-foreground/10 rounded-full h-1.5 mt-2 overflow-hidden">
          <div className="bg-orange-400 h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
