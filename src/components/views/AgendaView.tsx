import AgendaList from '@/components/AgendaList';
import QCMList from '@/components/QCMList';
import type { CalendarEvent } from '@/lib/ical-parser';

interface AgendaViewProps {
  events: CalendarEvent[];
  taskStatus: Record<string, boolean>;
  onToggle: (key: string) => void;
  onExpandAgenda: () => void;
}

const AgendaView = ({ events, taskStatus, onToggle, onExpandAgenda }: AgendaViewProps) => (
  <div className="space-y-8 page-enter">
    <div>
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Planning</h2>
      <AgendaList events={events} onExpand={onExpandAgenda} />
    </div>
    <div>
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Deadlines</h2>
      <div className="fintech-card p-2 border border-foreground/5">
        <QCMList taskStatus={taskStatus} onToggle={onToggle} />
      </div>
    </div>
  </div>
);

export default AgendaView;
