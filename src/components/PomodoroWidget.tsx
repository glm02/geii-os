import { useState, useEffect } from 'react';

const PomodoroWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, isBreak]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 100 - (timeLeft / (isBreak ? 5 * 60 : 25 * 60)) * 100;

  return (
    <div onClick={e => e.stopPropagation()} className="w-full h-full flex flex-col justify-between items-center">
      <div className="text-xs font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
        {isBreak ? 'Pause ☕' : 'Focus 🔥'}
      </div>
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-foreground/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
          <path className={`${isBreak ? 'text-success' : 'text-destructive'} transition-all duration-1000`} strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="text-lg font-mono font-bold tracking-tighter">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
          isActive ? 'bg-foreground/10 hover:bg-foreground/20 text-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }`}
      >
        {isActive ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default PomodoroWidget;
