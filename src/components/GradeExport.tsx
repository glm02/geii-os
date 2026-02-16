import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { MODULES_CONFIG_S2 } from '@/lib/constants';
import { calcAvg, type Grade } from '@/lib/helpers';

interface GradeExportProps {
  gradesMap: Record<string, Grade[]>;
  stats: { avg21: string | null; avg22: string | null; global: string | null };
}

const GradeExport = ({ gradesMap, stats }: GradeExportProps) => {
  const [copied, setCopied] = useState(false);

  const exportGrades = () => {
    let text = "📊 Mes Notes GEII - S2\n\n";
    MODULES_CONFIG_S2.forEach(m => {
      const avg = calcAvg(gradesMap[m.id]);
      if (avg) text += `${m.label} (${m.id}): ${avg}/20\n`;
    });
    text += `\n📈 UE21: ${stats.avg21 || '--'} | UE22: ${stats.avg22 || '--'}\n`;
    text += `🎯 Moyenne Générale: ${stats.global || '--'}/20`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={exportGrades}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-xs font-bold text-muted-foreground"
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {copied ? 'Copié !' : 'Exporter Notes'}
    </button>
  );
};

export default GradeExport;
