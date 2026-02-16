import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface TimeGreetingProps {
  name: string;
}

const TimeGreeting = ({ name }: TimeGreetingProps) => {
  const hour = new Date().getHours();

  let greeting: string;
  let Icon: typeof Sun;
  let iconColor: string;

  if (hour < 6) { greeting = 'Bonne nuit'; Icon = Moon; iconColor = 'text-indigo-400'; }
  else if (hour < 12) { greeting = 'Bonjour'; Icon = Sunrise; iconColor = 'text-amber-400'; }
  else if (hour < 18) { greeting = 'Bon après-midi'; Icon = Sun; iconColor = 'text-yellow-400'; }
  else { greeting = 'Bonsoir'; Icon = Sunset; iconColor = 'text-orange-400'; }

  return (
    <div className="flex items-center gap-3">
      <div>
        <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider flex items-center gap-1.5">
          <Icon size={12} className={iconColor} /> Espace Étudiant
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}, {name}</h1>
      </div>
    </div>
  );
};

export default TimeGreeting;
