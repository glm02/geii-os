import { Timer } from 'lucide-react';

const ExamCountdown = () => {
  const examStart = new Date('2026-05-25');
  const now = new Date();
  const diff = examStart.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  const urgency = days <= 14 ? 'text-destructive' : days <= 30 ? 'text-warning' : 'text-primary';

  return (
    <div className="fintech-card p-4 border border-foreground/5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Examens</span>
        <Timer size={18} className={urgency} />
      </div>
      <div>
        <div className={`text-3xl font-bold tracking-tighter ${urgency}`}>J-{days}</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-1">Période examens</div>
      </div>
    </div>
  );
};

export default ExamCountdown;
