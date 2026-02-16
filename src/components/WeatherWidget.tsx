import { useState, useEffect } from 'react';
import { CloudSun } from 'lucide-react';

const WeatherWidget = () => {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=45.77&longitude=4.88&current_weather=true')
      .then(res => res.json())
      .then(d => setTemp(Math.round(d.current_weather.temperature)))
      .catch(() => {});
  }, []);

  return (
    <div className="fintech-card p-4 flex flex-col justify-between h-full border border-foreground/5">
      <div className="flex justify-between items-start">
        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Météo</div>
        <CloudSun size={20} className="text-yellow-400" />
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tighter">{temp ?? '--'}°</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-1">Villeurbanne</div>
      </div>
    </div>
  );
};

export default WeatherWidget;
