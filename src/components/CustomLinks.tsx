import { useState, useEffect, useCallback } from 'react';
import { Plus, X, ExternalLink, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CustomLink {
  id: string;
  name: string;
  url: string;
}

const CustomLinks = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<CustomLink[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('custom_links').select('*').eq('user_id', user.id).order('created_at');
    if (data) setLinks(data.map(d => ({ id: d.id, name: d.name, url: d.url })));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!name.trim() || !url.trim() || !user) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    await supabase.from('custom_links').insert({ user_id: user.id, name: name.trim(), url: fullUrl });
    setName(''); setUrl(''); setAdding(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('custom_links').delete().eq('id', id);
    load();
  };

  return (
    <div className="fintech-card p-5 border border-foreground/5 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Link2 size={14} /> Mes Liens
        </h3>
        <button onClick={() => setAdding(!adding)} className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
          {adding ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {adding && (
        <div className="space-y-2 bg-foreground/5 p-3 rounded-xl">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du lien" className="w-full bg-background/50 border border-foreground/10 rounded-lg p-2.5 text-sm outline-none placeholder-foreground/20" />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" className="w-full bg-background/50 border border-foreground/10 rounded-lg p-2.5 text-sm font-mono outline-none placeholder-foreground/20" />
          <button onClick={add} className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold">Ajouter</button>
        </div>
      )}

      {links.length === 0 && !adding && (
        <p className="text-xs text-muted-foreground text-center py-3">Aucun lien personnel ajouté.</p>
      )}

      {links.map(link => (
        <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors group">
          <ExternalLink size={14} className="text-primary shrink-0" />
          <span className="text-sm font-medium truncate flex-1">{link.name}</span>
          <button onClick={e => { e.preventDefault(); remove(link.id); }} className="text-destructive/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </a>
      ))}
    </div>
  );
};

export default CustomLinks;
