import { useState } from 'react';
import { Target } from 'lucide-react';
import { MODULES_CONFIG_S2 } from '@/lib/constants';
import { type Grade } from '@/lib/helpers';
import type { ModuleConfig } from '@/lib/constants';
import UESection from '@/components/UESection';
import { Archive } from 'lucide-react';

interface NotesViewProps {
  semester: number;
  setSemester: (s: number) => void;
  visibleUEs: { 21: boolean; 22: boolean };
  setVisibleUEs: (v: { 21: boolean; 22: boolean }) => void;
  s2Grades: Record<string, Grade[]>;
  absences: Record<string, number>;
  stats: { avg21: string | null; avg22: string | null };
  history: Record<string, Record<string, string>>;
  onModuleClick: (mod: ModuleConfig) => void;
  onAbsenceUpdate: (modId: string, delta: number) => void;
  onHistoryUpdate: (sem: number, key: string, val: string) => void;
}

const SemesterSelector = ({ current, onChange }: { current: number; onChange: (s: number) => void }) => (
  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
    {[1, 2, 3, 4].map(s => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
          current === s
            ? 'bg-foreground text-background border-foreground'
            : 'bg-card border-foreground/10 text-muted-foreground hover:text-foreground'
        }`}
      >
        Semestre {s}
      </button>
    ))}
  </div>
);

const TargetSimulator = () => {
  const [currentAvg, setCurrentAvg] = useState('');
  const [target, setTarget] = useState('');
  const [coefNext, setCoefNext] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const cur = parseFloat(currentAvg), tar = parseFloat(target), coef = parseFloat(coefNext);
    if (cur && tar && coef) setResult((((tar * (1 + coef)) - cur) / coef).toFixed(2));
  };

  return (
    <div className="fintech-card p-5 border border-foreground/5 space-y-4">
      <h3 className="font-bold text-sm flex gap-2 text-primary uppercase tracking-wider items-center">
        <Target size={16} /> Simulateur Objectif
      </h3>
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase font-bold">Actuel</label>
          <input type="number" value={currentAvg} onChange={e => setCurrentAvg(e.target.value)} className="w-full bg-background/50 p-2.5 rounded-lg text-sm border border-foreground/10 font-mono placeholder-foreground/20" />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase font-bold">Cible</label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-background/50 p-2.5 rounded-lg text-sm border border-foreground/10 font-mono placeholder-foreground/20" />
        </div>
        <div className="w-16 space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase font-bold">Coef</label>
          <input type="number" value={coefNext} onChange={e => setCoefNext(e.target.value)} className="w-full bg-background/50 p-2.5 rounded-lg text-sm border border-foreground/10 font-mono placeholder-foreground/20" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button onClick={calculate} className="bg-foreground/10 py-2 px-4 rounded-lg text-xs font-bold hover:bg-foreground/20 transition-colors">Calculer</button>
        {result && (
          <div className="text-sm font-medium">
            Il faut : <span className={`font-bold font-mono text-lg ml-1 ${parseFloat(result) > 20 ? 'text-destructive' : 'text-success'}`}>{result}/20</span>
          </div>
        )}
      </div>
    </div>
  );
};

const NotesView = ({ semester, setSemester, visibleUEs, setVisibleUEs, s2Grades, absences, stats, history, onModuleClick, onAbsenceUpdate, onHistoryUpdate }: NotesViewProps) => (
  <div className="space-y-6 page-enter">
    <SemesterSelector current={semester} onChange={setSemester} />
    {semester === 2 ? (
      <div className="space-y-6">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setVisibleUEs({ ...visibleUEs, 21: !visibleUEs[21] })}
            className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
              visibleUEs[21] ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-card text-muted-foreground border-border'
            }`}
          >
            UE21 • Concevoir
          </button>
          <button
            onClick={() => setVisibleUEs({ ...visibleUEs, 22: !visibleUEs[22] })}
            className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
              visibleUEs[22] ? 'bg-foreground text-background border-foreground shadow-lg' : 'bg-card text-muted-foreground border-border'
            }`}
          >
            UE22 • Vérifier
          </button>
        </div>

        <TargetSimulator />

        {visibleUEs[21] && <UESection title="UE21 - Concevoir" ueKey="coef21" avg={stats.avg21} modules={MODULES_CONFIG_S2} gradesMap={s2Grades} absences={absences} onModuleClick={onModuleClick} onAbsenceUpdate={onAbsenceUpdate} />}
        {visibleUEs[22] && <UESection title="UE22 - Vérifier" ueKey="coef22" avg={stats.avg22} modules={MODULES_CONFIG_S2} gradesMap={s2Grades} absences={absences} onModuleClick={onModuleClick} onAbsenceUpdate={onAbsenceUpdate} />}
      </div>
    ) : (
      <div className="space-y-4">
        <div className="fintech-card p-8 border border-foreground/5 text-center">
          <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-xl mb-2">Historique S{semester}</h3>
          <p className="text-sm text-muted-foreground mb-6">Saisissez vos moyennes validées.</p>
          <div className="space-y-4">
            {['1', '2'].map(ue => {
              const key = `ue${semester}${ue}`;
              return (
                <div key={key} className="fintech-card p-5 border border-foreground/5 flex justify-between items-center">
                  <span className="font-bold text-sm text-muted-foreground">Moyenne UE{semester}{ue}</span>
                  <input
                    type="number"
                    value={history[`s${semester}`]?.[key] || ''}
                    onChange={e => onHistoryUpdate(semester, key, e.target.value)}
                    className="w-20 bg-background/50 border border-foreground/10 rounded-lg p-2.5 text-center font-mono font-bold focus:border-primary outline-none"
                    placeholder="--"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
);

export default NotesView;
