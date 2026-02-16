import { GraduationCap, Coffee, Shield } from 'lucide-react';
import type { ViewId } from '@/components/BottomNav';

interface QuickActionsProps {
  onViewChange: (view: ViewId) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
}

const QuickActions = ({ onViewChange, isAdmin, onAdminClick }: QuickActionsProps) => {
  const actions = [
    { icon: GraduationCap, label: 'Notes', color: 'bg-primary/10 text-primary', action: () => onViewChange('NOTES') },
    { icon: Coffee, label: 'Campus', color: 'bg-orange-500/10 text-orange-400', action: () => onViewChange('LIFE') },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', color: 'bg-destructive/10 text-destructive', action: onAdminClick }] : []),
  ];

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar">
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={a.action}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${a.color} text-xs font-bold whitespace-nowrap active:scale-95 transition-transform border border-foreground/5`}
        >
          <a.icon size={14} />
          {a.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
