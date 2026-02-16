import { Utensils, Train, ArrowUpRight, ChevronRight, GraduationCap, FileText, Calendar, Mail, Paperclip } from 'lucide-react';
import { USEFUL_LINKS, LINKS } from '@/lib/constants';

const iconMap: Record<string, typeof GraduationCap> = {
  GraduationCap, FileText, Calendar, Mail, Paperclip, Train,
};

const CrousWidget = () => {
  const hour = new Date().getHours();
  const isOpen = hour >= 11 && hour < 14;

  return (
    <a href={LINKS.CROUS} target="_blank" rel="noopener noreferrer" className="fintech-card p-5 border border-foreground/5 flex flex-col justify-between active:scale-95 transition-transform hover:bg-card-hover">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Utensils size={20} />
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${isOpen ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
          {isOpen ? 'OUVERT' : 'FERMÉ'}
        </span>
      </div>
      <div>
        <div className="font-bold text-base mt-2">Resto U</div>
        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
          Menu du jour <ArrowUpRight size={10} />
        </div>
      </div>
    </a>
  );
};

const TrafficWidget = () => (
  <a href={LINKS.TCL} target="_blank" rel="noopener noreferrer" className="fintech-card p-5 border border-foreground/5 flex flex-col justify-between active:scale-95 transition-transform hover:bg-card-hover">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        <Train size={20} />
      </div>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-success" />
        <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
      </div>
    </div>
    <div>
      <div className="font-bold text-base mt-2">Info Trafic</div>
      <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
        TCL Direct <ArrowUpRight size={10} />
      </div>
    </div>
  </a>
);

const LifeView = () => (
  <div className="space-y-8 page-enter">
    <div>
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Campus</h2>
      <div className="grid grid-cols-2 gap-4">
        <CrousWidget />
        <TrafficWidget />
      </div>
    </div>
    <div>
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Liens Utiles</h2>
      <div className="grid grid-cols-1 gap-3">
        {USEFUL_LINKS.map((link, i) => {
          const Icon = iconMap[link.icon] || FileText;
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 fintech-card p-4 border border-foreground/5 active:scale-[0.98] transition-transform hover:bg-card-hover"
            >
              <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center text-foreground shadow-lg`}>
                <Icon size={20} />
              </div>
              <span className="font-bold text-base">{link.name}</span>
              <ChevronRight size={20} className="ml-auto text-muted-foreground/50" />
            </a>
          );
        })}
      </div>
    </div>
  </div>
);

export default LifeView;
