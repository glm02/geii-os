const SemesterProgress = () => {
  const start = new Date('2026-01-05').getTime();
  const end = new Date('2026-06-30').getTime();
  const now = new Date().getTime();
  const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));

  return (
    <div className="fintech-card p-5 border border-foreground/5">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Semestre 2</span>
        <span className="text-xs font-mono font-bold text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden border border-foreground/5">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SemesterProgress;
