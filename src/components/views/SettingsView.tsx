import { Award } from 'lucide-react';

interface SettingsViewProps {
  profile: { firstName: string; lastName: string; adeUrl: string };
  stats: { global: string | null };
  onUpdateProfile: (updates: Partial<{ firstName: string; lastName: string; adeUrl: string }>) => void;
  onSignOut: () => void;
}

const SettingsView = ({ profile, stats, onUpdateProfile, onSignOut }: SettingsViewProps) => (
  <div className="space-y-6 page-enter">
    <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
    <div className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-3xl shadow-2xl shadow-primary/20 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <Award size={120} />
      </div>
      <div className="relative z-10">
        <div className="text-xs uppercase font-bold text-primary-foreground/70 mb-2 tracking-widest">Moyenne Générale</div>
        <div className="text-4xl font-bold text-primary-foreground mb-1">{stats.global || '--'}</div>
        <div className="text-sm font-mono text-primary-foreground/80 bg-primary-foreground/20 px-3 py-1 rounded-full inline-block">
          Semestre 2
        </div>
      </div>
    </div>

    <div className="fintech-card p-6 border border-foreground/5 space-y-6">
      <div>
        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-2">Prénom</label>
        <input
          value={profile.firstName}
          onChange={e => onUpdateProfile({ firstName: e.target.value })}
          className="w-full bg-background/50 border border-foreground/10 rounded-xl p-4 text-base focus:border-primary outline-none font-medium"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-2">Lien ADE (iCal)</label>
        <input
          value={profile.adeUrl}
          onChange={e => onUpdateProfile({ adeUrl: e.target.value })}
          className="w-full bg-background/50 border border-foreground/10 rounded-xl p-4 text-xs font-mono text-muted-foreground focus:border-primary outline-none break-all"
        />
      </div>
    </div>

    <button
      onClick={onSignOut}
      className="w-full py-4 text-destructive font-bold text-sm bg-destructive/10 rounded-xl border border-destructive/20 active:scale-95 transition-transform hover:bg-destructive/20"
    >
      Se déconnecter
    </button>
  </div>
);

export default SettingsView;
