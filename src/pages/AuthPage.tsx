import { useState } from 'react';
import { Zap, ArrowRight, HelpCircle, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_ADE } from '@/lib/constants';

const AuthPage = () => {
  const { signUp, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [adeUrl, setAdeUrl] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Vérifie ton email pour confirmer ton compte !');
      }
    }
    setLoading(false);
  };

  const handleSignUpAndProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      if (!firstName) {
        setError('Veuillez remplir votre prénom.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        // We store the profile data in localStorage temporarily, 
        // it'll be saved to DB after email confirmation
        localStorage.setItem('geii_pending_profile', JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          ade_url: adeUrl || DEFAULT_ADE,
        }));
        setSuccess('Vérifie ton email pour confirmer ton compte !');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="relative z-10 space-y-8 max-w-md mx-auto w-full">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <Zap size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {isLogin ? 'Connexion' : 'Bienvenue'}<br />
            <span className="text-primary">GEII OS</span>
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Connecte-toi à ton espace étudiant.' : 'Ton assistant étudiant personnel.'}
          </p>
        </div>

        <form onSubmit={handleSignUpAndProfile} className="space-y-4">
          {!isLogin && (
            <div className="fintech-card p-1 border border-foreground/5">
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Ton Prénom"
                className="w-full bg-transparent p-4 placeholder-foreground/30 outline-none"
              />
              <div className="h-[1px] bg-foreground/5 mx-4" />
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Ton Nom"
                className="w-full bg-transparent p-4 placeholder-foreground/30 outline-none"
              />
            </div>
          )}

          <div className="fintech-card p-1 border border-foreground/5">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent p-4 placeholder-foreground/30 outline-none"
              required
            />
            <div className="h-[1px] bg-foreground/5 mx-4" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-transparent p-4 placeholder-foreground/30 outline-none"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <div className="fintech-card p-1 flex items-center border border-foreground/5">
                <input
                  value={adeUrl}
                  onChange={e => setAdeUrl(e.target.value)}
                  placeholder="Lien Export Agenda (ADE) - optionnel"
                  className="w-full bg-transparent p-4 placeholder-foreground/30 outline-none text-sm"
                />
                <button type="button" onClick={() => setShowHelp(!showHelp)} className="p-3 text-primary">
                  <HelpCircle size={20} />
                </button>
              </div>
              {showHelp && (
                <div className="fintech-card p-4 text-sm text-muted-foreground space-y-2 border border-foreground/5">
                  <p className="font-bold text-foreground flex items-center gap-2"><Info size={14} /> Tuto Rapide :</p>
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Allez sur <b>ADE</b>.</li>
                    <li>Cliquez sur l'onglet <b>"Exporter"</b>.</li>
                    <li>Choisissez <b>"Générer URL"</b>.</li>
                    <li>Copiez le lien <code className="bg-foreground/10 px-1 rounded">https://edt...</code></li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-destructive text-xs text-center bg-destructive/10 p-3 rounded-xl">{error}</p>}
          {success && <p className="text-success text-xs text-center bg-success/10 p-3 rounded-xl">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
            <ArrowRight size={20} />
          </button>
        </form>

        <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
