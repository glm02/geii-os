import { TASKS_DATA } from '@/lib/constants';
import { getModuleName } from '@/lib/helpers';

interface UpcomingDeadlineProps {
  taskStatus: Record<string, boolean>;
}

const UpcomingDeadline = ({ taskStatus }: UpcomingDeadlineProps) => {
  const now = new Date();
  const upcoming = TASKS_DATA
    .filter(t => !taskStatus[t.title + t.module])
    .map(t => ({ ...t, diff: new Date(t.end).getTime() - now.getTime() }))
    .filter(t => t.diff > 0)
    .sort((a, b) => a.diff - b.diff)[0];

  if (!upcoming) {
    return (
      <div className="fintech-card p-4 flex items-center justify-center text-xs text-muted-foreground border border-foreground/5 h-full">
        Aucun devoir 🔥
      </div>
    );
  }

  const days = Math.ceil(upcoming.diff / (1000 * 60 * 60 * 24));

  return (
    <div className="fintech-card p-4 flex flex-col justify-between border border-foreground/5 border-l-4 border-l-warning h-full">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-warning uppercase tracking-wider">Urgent</span>
        <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold">J-{days}</span>
      </div>
      <div>
        <div className="font-bold text-sm truncate">{upcoming.title}</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{getModuleName(upcoming.module)}</div>
      </div>
    </div>
  );
};

export default UpcomingDeadline;
