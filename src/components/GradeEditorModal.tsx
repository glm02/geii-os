import { useState } from 'react';
import { X } from 'lucide-react';
import { calcAvg, getGradeColor, type Grade } from '@/lib/helpers';
import type { ModuleConfig } from '@/lib/constants';

interface GradeEditorModalProps {
  module: ModuleConfig;
  grades: Grade[];
  onClose: () => void;
  onSave: (grades: Grade[]) => void;
}

const GradeEditorModal = ({ module, grades, onClose, onSave }: GradeEditorModalProps) => {
  const [localGrades, setLocalGrades] = useState<Grade[]>(grades || []);
  const [val, setVal] = useState('');
  const [coef, setCoef] = useState('1');
  const [name, setName] = useState('');

  const add = () => {
    if (val) {
      const next = [...localGrades, { id: Date.now().toString(), value: val, coef, name: name || 'Note' }];
      setLocalGrades(next);
      onSave(next);
      setVal('');
      setName('');
    }
  };

  const remove = (id: string) => {
    const next = localGrades.filter(g => g.id !== id);
    setLocalGrades(next);
    onSave(next);
  };

  const avg = calcAvg(localGrades) || "—";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center glass-modal animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-t-[2rem] border-t border-foreground/10 flex flex-col max-h-[90vh]">
        <div className="p-6 flex justify-between items-center border-b border-foreground/5 bg-card">
          <div>
            <h3 className="font-bold text-xl tracking-tight">
              {module.label}{' '}
              <span className={`ml-2 text-2xl font-mono ${getGradeColor(avg)}`}>{avg}</span>
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
              {module.id} • {module.cat}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-foreground/10 rounded-full flex items-center justify-center hover:bg-foreground/20 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto pb-safe space-y-6">
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
            <label className="text-xs font-bold text-primary uppercase tracking-wider">Ajouter une note</label>
            <div className="flex gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Titre (ex: DS1)" className="flex-1 bg-background/50 border border-foreground/10 rounded-xl p-3 text-sm focus:border-primary outline-none placeholder-foreground/20" />
              <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="20" className="w-16 bg-background/50 border border-foreground/10 rounded-xl p-3 text-sm font-bold text-center focus:border-primary outline-none placeholder-foreground/20" />
              <input type="number" value={coef} onChange={e => setCoef(e.target.value)} placeholder="1" className="w-14 bg-background/50 border border-foreground/10 rounded-xl p-3 text-sm text-center text-muted-foreground focus:border-primary outline-none placeholder-foreground/20" />
            </div>
            <button onClick={add} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              Confirmer
            </button>
          </div>
          <div className="space-y-3">
            {localGrades.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6 bg-foreground/5 rounded-xl border-dashed border border-foreground/10">
                Aucune note enregistrée
              </p>
            ) : (
              localGrades.slice().reverse().map(g => (
                <div key={g.id} className="flex justify-between items-center bg-accent p-4 rounded-xl border border-foreground/5">
                  <div>
                    <div className="font-bold text-sm">{g.name}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">Coef {g.coef}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono font-bold text-lg ${getGradeColor(g.value)}`}>{g.value}</span>
                    <button onClick={() => remove(g.id)} className="text-destructive opacity-40 hover:opacity-100 transition-opacity">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeEditorModal;
