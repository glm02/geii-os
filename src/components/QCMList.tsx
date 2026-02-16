import { Check } from 'lucide-react';
import { TASKS_DATA } from '@/lib/constants';
import { getModuleName } from '@/lib/helpers';

interface QCMListProps {
  taskStatus: Record<string, boolean>;
  onToggle: (key: string) => void;
}

const QCMList = ({ taskStatus, onToggle }: QCMListProps) => {
  const allTasks = [...TASKS_DATA].sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime());
  const now = new Date();

  return (
    <div className="space-y-2">
      {allTasks.map((task, i) => {
        const uid = task.title + task.module;
        const isDone = taskStatus[uid];
        const diffDays = Math.ceil((new Date(task.end).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let color = "text-muted-foreground", text = `${diffDays}j`;
        if (isDone) { text = "Fait"; color = "text-success"; }
        else if (diffDays < 0) { text = "Retard"; color = "text-destructive"; }
        else if (diffDays <= 3) { text = `J-${diffDays}`; color = "text-destructive font-bold"; }
        else if (diffDays <= 7) { text = `J-${diffDays}`; color = "text-warning"; }

        return (
          <div
            key={i}
            onClick={() => onToggle(uid)}
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
              isDone ? 'bg-background/30 border-foreground/5 opacity-50' : 'fintech-card border-foreground/5 hover:bg-card-hover'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                isDone ? 'bg-success border-success' : 'border-muted-foreground/50'
              }`}>
                {isDone && <Check size={12} className="text-success-foreground stroke-[3px]" />}
              </div>
              <div>
                <div className={`font-bold text-sm ${isDone ? 'line-through text-muted-foreground' : ''}`}>{task.title}</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5 flex gap-1.5 items-center">
                  <span className="bg-foreground/10 px-1.5 py-0 rounded text-[9px] text-foreground/80">{getModuleName(task.module)}</span>
                  <span>{new Date(task.end).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <div className={`text-xs font-mono font-bold ${color}`}>{text}</div>
          </div>
        );
      })}
    </div>
  );
};

export default QCMList;
