import { LayoutGrid, GraduationCap, Calendar, Coffee, User } from 'lucide-react';

type ViewId = 'HOME' | 'NOTES' | 'AGENDA' | 'LIFE' | 'SETTINGS';

const navItems: { id: ViewId; icon: typeof LayoutGrid; label: string }[] = [
  { id: 'HOME', icon: LayoutGrid, label: 'Accueil' },
  { id: 'NOTES', icon: GraduationCap, label: 'Notes' },
  { id: 'AGENDA', icon: Calendar, label: 'Agenda' },
  { id: 'LIFE', icon: Coffee, label: 'Campus' },
  { id: 'SETTINGS', icon: User, label: 'Profil' },
];

interface BottomNavProps {
  active: ViewId;
  setView: (view: ViewId) => void;
}

const BottomNav = ({ active, setView }: BottomNavProps) => (
  <div className="fixed bottom-0 w-full bg-card/95 backdrop-blur-xl border-t border-foreground/5 pb-safe pt-2 px-6 flex justify-between z-50">
    {navItems.map(item => {
      const Icon = item.icon;
      const isActive = active === item.id;
      return (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center p-2 transition-all duration-200 active:scale-90 relative ${
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isActive && (
            <div className="absolute -top-2 w-8 h-1 rounded-full bg-primary" />
          )}
          <Icon size={22} className={`mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
        </button>
      );
    })}
  </div>
);

export default BottomNav;
export type { ViewId };
