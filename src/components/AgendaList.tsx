import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, MapPin } from 'lucide-react';
import type { CalendarEvent } from '@/lib/ical-parser';

interface AgendaListProps {
  events: CalendarEvent[];
  onExpand?: () => void;
}

const getCourseStyle = (summary: string) => {
  const s = summary.toLowerCase();
  if (s.includes('ds') || s.includes('exam')) return { type: 'EXAMEN', color: 'border-l-destructive bg-destructive/5', badge: 'bg-destructive/10 text-destructive border border-destructive/20' };
  if (s.includes('amphi') || s.includes('cm')) return { type: 'CM', color: 'border-l-purple-500 bg-purple-500/5', badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' };
  if (s.includes('tp')) return { type: 'TP', color: 'border-l-blue-500 bg-blue-500/5', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
  return { type: 'Cours', color: 'border-l-foreground/20 bg-foreground/5', badge: 'bg-foreground/10 text-muted-foreground border border-foreground/10' };
};

const AgendaList = ({ events, onExpand }: AgendaListProps) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekRange = (offset: number) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { start: monday, end: sunday };
  };

  const { start, end } = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
  const weekEvents = events.filter(e => e.start >= start && e.start <= end);

  const grouped = weekEvents.reduce((acc: Record<string, CalendarEvent[]>, event) => {
    const dateKey = event.start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => grouped[a][0].start.getTime() - grouped[b][0].start.getTime());

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center fintech-card p-3 border border-foreground/5">
        <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Semaine du</div>
          <div className="text-sm font-bold">{start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
        </div>
        <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {onExpand && (
        <div className="flex justify-end">
          <button onClick={onExpand} className="bg-foreground/5 border border-foreground/10 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-foreground/10 transition-colors uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <Maximize2 size={12} /> Agrandir
          </button>
        </div>
      )}

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3 opacity-50">
          <span className="text-3xl">☕</span>
          <span className="text-sm font-medium">Semaine libre !</span>
        </div>
      ) : (
        sortedDates.map((date, index) => (
          <div key={index}>
            <h3 className="text-xs font-bold text-primary uppercase sticky top-0 bg-background/95 backdrop-blur-xl py-3 z-10 flex items-center gap-2 border-b border-transparent">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {date}
            </h3>
            <div className="space-y-3 mt-1">
              {grouped[date].map((e, i) => {
                const style = getCourseStyle(e.summary);
                const now = new Date();
                const isLive = now >= e.start && now <= e.end;
                return (
                  <div key={i} className={`relative fintech-card p-4 border border-foreground/5 border-l-4 ${style.color} ${isLive ? 'ring-1 ring-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.3)]' : ''}`}>
                    {isLive && <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full animate-pulse shadow-lg shadow-primary/40">EN COURS</div>}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-foreground/5 pr-4 py-1">
                        <span className="font-bold text-sm">{e.start.getHours()}h{e.start.getMinutes().toString().padStart(2, '0')}</span>
                        <div className="h-4 w-0.5 bg-foreground/10 rounded-full my-0.5" />
                        <span className="text-[10px] text-muted-foreground font-medium">{e.end.getHours()}h{e.end.getMinutes().toString().padStart(2, '0')}</span>
                      </div>
                      <div className="overflow-hidden flex-1 flex flex-col justify-center">
                        <div className="font-bold text-sm truncate pr-8 leading-tight mb-1.5">{e.summary}</div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wide uppercase ${style.badge}`}>{style.type}</span>
                          <div className="text-xs text-muted-foreground truncate flex gap-1 items-center font-medium">
                            <MapPin size={10} /> {e.location || 'Salle inconnue'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AgendaList;
