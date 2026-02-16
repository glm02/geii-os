import { Award, Shield, User, LogOut, Link2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SettingsViewProps {
  profile: { firstName: string; lastName: string; adeUrl: string };
  stats: { global: string | null };
  onUpdateProfile: (updates: Partial<{ firstName: string; lastName: string; adeUrl: string }>) => void;
  onSignOut: () => void;
}

const SettingsView = ({ profile, stats, onUpdateProfile, onSignOut }: SettingsViewProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user]);

  return (
    <div className="space-y-6 page-enter">
      <h2 className="text-3xl font-bold tracking-tight">Profil</h2>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-3xl shadow-2xl shadow-primary/20 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Award size={120} />
        </div>
        <div className="w-20 h-20 rounded-full bg-primary-foreground/20 border-2 border-primary-foreground/30 flex items-center justify-center mb-4 relative z-10">
          <span className="text-2xl font-bold text-primary-foreground">{profile.firstName[0]?.toUpperCase()}{profile.lastName?.[0]?.toUpperCase() || ''}</span>
        </div>
        <div className="relative z-10">
          <div className="text-lg font-bold text-primary-foreground mb-1">{profile.firstName} {profile.lastName}</div>
          <div className="text-xs uppercase font-bold text-primary-foreground/70 mb-3 tracking-widest">Étudiant GEII</div>
          <div className="text-4xl font-bold text-primary-foreground mb-1">{stats.global || '--'}</div>
          <div className="text-sm font-mono text-primary-foreground/80 bg-primary-foreground/20 px-3 py-1 rounded-full inline-block">
            Moyenne S2
          </div>
        </div>
      </div>

      {/* Profile Fields */}
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
          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-2">Nom</label>
          <input
            value={profile.lastName}
            onChange={e => onUpdateProfile({ lastName: e.target.value })}
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

      {/* Quick Info */}
      <div className="fintech-card border border-foreground/5 divide-y divide-foreground/5">
        <div className="p-4 flex items-center gap-3">
          <User size={18} className="text-muted-foreground" />
          <span className="text-sm flex-1">Email</span>
          <span className="text-xs text-muted-foreground font-mono">{user?.email}</span>
        </div>
        <div className="p-4 flex items-center gap-3">
          <Link2 size={18} className="text-muted-foreground" />
          <span className="text-sm flex-1">Version</span>
          <span className="text-xs text-muted-foreground font-mono">GEII OS v2.0</span>
        </div>
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="w-full py-4 font-bold text-sm bg-card rounded-xl border border-destructive/20 flex items-center justify-center gap-2 text-foreground hover:border-destructive/50 transition-colors"
        >
          <Shield size={18} className="text-destructive" /> Panel Administration
          <ChevronRight size={16} className="ml-auto text-muted-foreground" />
        </button>
      )}

      {/* Logout */}
      <button
        onClick={onSignOut}
        className="w-full py-4 text-destructive font-bold text-sm bg-destructive/10 rounded-xl border border-destructive/20 active:scale-95 transition-transform hover:bg-destructive/20 flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> Se déconnecter
      </button>
    </div>
  );
};

export default SettingsView;
