import { Calculator, ArrowUpRight } from 'lucide-react';
import WeatherWidget from '@/components/WeatherWidget';
import PomodoroWidget from '@/components/PomodoroWidget';
import SemesterProgress from '@/components/SemesterProgress';
import UpcomingDeadline from '@/components/UpcomingDeadline';
import { Edit3 } from 'lucide-react';
import type { CalendarEvent } from '@/lib/ical-parser';
import type { ViewId } from '@/components/BottomNav';

interface HomeViewProps {
  stats: { global: string | null };
  taskStatus: Record<string, boolean>;
  events: CalendarEvent[];
  quickNote: string;
  onNoteChange: (note: string) => void;
  onViewChange: (view: ViewId) => void;
}

const HomeView = ({ stats, taskStatus, events, quickNote, onNoteChange, onViewChange }: HomeViewProps) => {
  const currentWeekEvents = (() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);
    return events.filter(e => e.start >= monday && e.start < sunday);
  })();

  return (
    <div className="space-y-4 page-enter">
      <div className="grid grid-cols-2 gap-3 h-40">
        <div
          className="fintech-card p-4 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:bg-card-hover border border-foreground/5 transition-colors"
          onClick={() => onViewChange('NOTES')}
        >
          <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-primary/10 rounded-full text-primary"><Calculator size={20} /></div>
            <ArrowUpRight size={16} className="text-muted-foreground" />
          </div>
          <div className="z-10">
            <div className="text-3xl font-bold tracking-tighter">{stats.global || '--'}</div>
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Moyenne S2</div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
        </div>
        <WeatherWidget />
      </div>

      <div className="grid grid-cols-2 gap-3 h-40">
        <UpcomingDeadline taskStatus={taskStatus} />
        <div className="fintech-card p-4 border border-foreground/5 active:scale-95 transition-transform">
          <PomodoroWidget />
        </div>
      </div>

      <SemesterProgress />

      <div className="fintech-card p-5 border border-foreground/5">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">Mon Planning</h3>
        {currentWeekEvents.length > 0 ? (
          currentWeekEvents.slice(0, 3).map((e, i) => (
            <div key={i} className="flex gap-4 mb-4 last:mb-0 items-center">
              <div className="text-xs font-bold text-muted-foreground w-10 text-right">
                {e.start.getHours()}h{e.start.getMinutes() || '00'}
              </div>
              <div className="w-1 h-8 rounded-full bg-primary/50" />
              <div className="flex-1">
                <div className="font-bold text-sm truncate">{e.summary}</div>
                <div className="text-xs text-muted-foreground truncate">{e.location}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-xs text-muted-foreground py-6 bg-foreground/5 rounded-xl">Rien à l'horizon 🏖️</div>
        )}
      </div>

      <div className="fintech-card p-4 flex flex-col gap-2 border border-foreground/5 min-h-[120px]">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Edit3 size={14} /> Notes
        </div>
        <textarea
          value={quickNote}
          onChange={e => onNoteChange(e.target.value)}
          placeholder="Code, salle, mémo..."
          className="bg-transparent border-none outline-none text-xs resize-none h-full w-full placeholder-foreground/20 leading-relaxed font-medium flex-1"
        />
      </div>
    </div>
  );
};

export default HomeView;
