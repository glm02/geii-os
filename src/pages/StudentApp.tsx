import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DEFAULT_ADE, MODULES_CONFIG_S2, TASKS_DATA } from '@/lib/constants';
import { calcAvg, type Grade } from '@/lib/helpers';
import { parseICS, generateDemoSchedule, type CalendarEvent } from '@/lib/ical-parser';
import BottomNav, { type ViewId } from '@/components/BottomNav';
import HomeView from '@/components/views/HomeView';
import NotesView from '@/components/views/NotesView';
import AgendaView from '@/components/views/AgendaView';
import LifeView from '@/components/views/LifeView';
import SettingsView from '@/components/views/SettingsView';
import GradeEditorModal from '@/components/GradeEditorModal';
import type { ModuleConfig } from '@/lib/constants';
import { Calendar, X } from 'lucide-react';
import AgendaList from '@/components/AgendaList';

const StudentApp = () => {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<ViewId>('HOME');
  const [showFullAgenda, setShowFullAgenda] = useState(false);

  // Profile
  const [profile, setProfile] = useState({ firstName: '', lastName: '', adeUrl: DEFAULT_ADE });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [quickNote, setQuickNote] = useState('');

  // Academic
  const [semester, setSemester] = useState(2);
  const [visibleUEs, setVisibleUEs] = useState({ 21: true, 22: true });
  const [s2Grades, setS2Grades] = useState<Record<string, Grade[]>>({});
  const [absences, setAbsences] = useState<Record<string, number>>({});
  const [taskStatus, setTaskStatus] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<Record<string, Record<string, string>>>({});
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(null);

  // Agenda
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);

  // Announcements
  const [announcements, setAnnouncements] = useState<{ text: string; type: string }[]>([]);

  // Load profile from DB
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      // Check for pending profile data from signup first
      const pending = localStorage.getItem('geii_pending_profile');
      if (pending) {
        const p = JSON.parse(pending);
        // Use upsert in case the trigger already created a bare profile
        await supabase.from('profiles').upsert({
          user_id: user.id,
          first_name: p.first_name,
          last_name: p.last_name,
          ade_url: p.ade_url,
        }, { onConflict: 'user_id' });
        setProfile({ firstName: p.first_name, lastName: p.last_name, adeUrl: p.ade_url });
        setProfileLoaded(true);
        localStorage.removeItem('geii_pending_profile');
        return;
      }

      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfile({ firstName: data.first_name || (user.email?.split('@')[0] ?? ''), lastName: data.last_name || '', adeUrl: data.ade_url || DEFAULT_ADE });
        setQuickNote(data.quick_note || '');
      }
      setProfileLoaded(true);
    };

    const loadGrades = async () => {
      const { data } = await supabase.from('grades').select('*').eq('user_id', user.id);
      if (data) {
        const map: Record<string, Grade[]> = {};
        data.forEach(g => {
          if (!map[g.module_id]) map[g.module_id] = [];
          map[g.module_id].push({ id: g.id, value: String(g.value), coef: String(g.coef), name: g.name });
        });
        setS2Grades(map);
      }
    };

    const loadAbsences = async () => {
      const { data } = await supabase.from('absences').select('*').eq('user_id', user.id);
      if (data) {
        const map: Record<string, number> = {};
        data.forEach(a => { map[a.module_id] = a.count; });
        setAbsences(map);
      }
    };

    const loadTaskStatus = async () => {
      const { data } = await supabase.from('task_status').select('*').eq('user_id', user.id);
      if (data) {
        const map: Record<string, boolean> = {};
        data.forEach(t => { map[t.task_key] = t.done; });
        setTaskStatus(map);
      }
    };

    const loadHistory = async () => {
      const { data } = await supabase.from('semester_history').select('*').eq('user_id', user.id);
      if (data) {
        const map: Record<string, Record<string, string>> = {};
        data.forEach(h => {
          map[`s${h.semester}`] = { [`ue${h.semester}1`]: String(h.ue1_avg ?? ''), [`ue${h.semester}2`]: String(h.ue2_avg ?? '') };
        });
        setHistory(map);
      }
    };

    loadProfile();
    loadGrades();
    loadAbsences();
    loadTaskStatus();
    loadHistory();

    // Listen to announcements
    const channel = supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).then(({ data }) => {
          if (data) setAnnouncements(data.map(a => ({ text: a.text, type: a.type })));
        });
      })
      .subscribe();

    // Initial load announcements
    supabase.from('announcements').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setAnnouncements(data.map(a => ({ text: a.text, type: a.type })));
    });

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Fetch agenda
  useEffect(() => {
    if (!profile.adeUrl) return;
    const fetchSchedule = async () => {
      let text = "";
      let success = false;
      const proxies = [
        'https://corsproxy.io/?' + encodeURIComponent(profile.adeUrl),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent(profile.adeUrl),
      ];
      for (const url of proxies) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            text = await res.text();
            if (text.includes("BEGIN:VCALENDAR")) { success = true; break; }
          }
        } catch { /* continue */ }
      }
      if (!success) text = generateDemoSchedule();
      setAllEvents(parseICS(text).sort((a, b) => a.start.getTime() - b.start.getTime()));
    };
    fetchSchedule();
  }, [profile.adeUrl]);

  // Stats
  const stats = useMemo(() => {
    let p21 = 0, c21 = 0, p22 = 0, c22 = 0;
    MODULES_CONFIG_S2.forEach(m => {
      const avg = parseFloat(calcAvg(s2Grades[m.id]) || '');
      if (!isNaN(avg)) {
        if (m.coef21 > 0) { p21 += avg * m.coef21; c21 += m.coef21; }
        if (m.coef22 > 0) { p22 += avg * m.coef22; c22 += m.coef22; }
      }
    });
    const avg21 = c21 ? (p21 / c21).toFixed(2) : null;
    const avg22 = c22 ? (p22 / c22).toFixed(2) : null;
    const global = (avg21 && avg22) ? ((parseFloat(avg21) + parseFloat(avg22)) / 2).toFixed(2) : null;
    return { avg21, avg22, global };
  }, [s2Grades]);

  // Actions
  const handleUpdateGrades = useCallback(async (grades: Grade[]) => {
    if (!selectedModule || !user) return;
    const nm = { ...s2Grades, [selectedModule.id]: grades };
    setS2Grades(nm);
    // Sync to DB: delete all grades for this module, re-insert
    await supabase.from('grades').delete().eq('user_id', user.id).eq('module_id', selectedModule.id);
    if (grades.length > 0) {
      await supabase.from('grades').insert(
        grades.map(g => ({ user_id: user.id, module_id: selectedModule.id, name: g.name, value: parseFloat(g.value), coef: parseFloat(g.coef) }))
      );
    }
  }, [selectedModule, s2Grades, user]);

  const updateAbsence = useCallback(async (modId: string, delta: number) => {
    if (!user) return;
    const newCount = Math.max(0, (absences[modId] || 0) + delta);
    setAbsences(a => ({ ...a, [modId]: newCount }));
    await supabase.from('absences').upsert({ user_id: user.id, module_id: modId, count: newCount }, { onConflict: 'user_id,module_id' });
  }, [absences, user]);

  const toggleTask = useCallback(async (key: string) => {
    if (!user) return;
    const done = !taskStatus[key];
    setTaskStatus(ts => ({ ...ts, [key]: done }));
    await supabase.from('task_status').upsert({ user_id: user.id, task_key: key, done }, { onConflict: 'user_id,task_key' });
  }, [taskStatus, user]);

  const updateProfile = useCallback(async (updates: Partial<typeof profile>) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await supabase.from('profiles').update({
      first_name: newProfile.firstName,
      last_name: newProfile.lastName,
      ade_url: newProfile.adeUrl,
    }).eq('user_id', user.id);
  }, [profile, user]);

  const updateQuickNote = useCallback(async (note: string) => {
    if (!user) return;
    setQuickNote(note);
    // Debounced save handled by profile update
    await supabase.from('profiles').update({ quick_note: note }).eq('user_id', user.id);
  }, [user]);

  const updateHistory = useCallback(async (sem: number, key: string, val: string) => {
    if (!user) return;
    const semKey = `s${sem}`;
    const newHist = { ...history, [semKey]: { ...history[semKey], [key]: val } };
    setHistory(newHist);
    const ue1Key = `ue${sem}1`;
    const ue2Key = `ue${sem}2`;
    await supabase.from('semester_history').upsert({
      user_id: user.id,
      semester: sem,
      ue1_avg: newHist[semKey]?.[ue1Key] ? parseFloat(newHist[semKey][ue1Key]) : null,
      ue2_avg: newHist[semKey]?.[ue2Key] ? parseFloat(newHist[semKey][ue2Key]) : null,
    }, { onConflict: 'user_id,semester' });
  }, [history, user]);

  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 font-sans selection:bg-primary/30 selection:text-foreground">
      {selectedModule && (
        <GradeEditorModal
          module={selectedModule}
          grades={s2Grades[selectedModule.id] || []}
          onClose={() => setSelectedModule(null)}
          onSave={handleUpdateGrades}
        />
      )}

      {showFullAgenda && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="sticky top-0 bg-background/95 backdrop-blur-md p-4 border-b border-border flex items-center justify-between z-10">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calendar size={20} /> Agenda Complet</h2>
            <button onClick={() => setShowFullAgenda(false)} className="p-2 bg-card rounded-full border border-border text-muted-foreground">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 pb-10">
            <AgendaList events={allEvents} />
          </div>
        </div>
      )}

      <header className="p-6 pt-12 flex justify-between items-center bg-gradient-to-b from-primary/10 to-transparent sticky top-0 z-40 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Espace Étudiant</div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {profile.firstName}</h1>
        </div>
        <div
          onClick={() => setView('SETTINGS')}
          className="w-10 h-10 rounded-full bg-card border border-foreground/10 flex items-center justify-center font-bold text-sm cursor-pointer hover:border-foreground/30 transition-colors"
        >
          {profile.firstName[0]?.toUpperCase()}
        </div>
      </header>

      <main className="px-4 space-y-8">
        {announcements.length > 0 && (
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl flex items-start gap-3 shadow-lg shadow-primary/20 mb-4">
            <div>
              <div className="font-bold text-sm uppercase tracking-wide mb-1">Info Admin</div>
              <div className="text-sm opacity-90 leading-relaxed">{announcements[0].text}</div>
            </div>
          </div>
        )}

        {view === 'HOME' && (
          <HomeView
            stats={stats}
            taskStatus={taskStatus}
            events={allEvents}
            quickNote={quickNote}
            onNoteChange={updateQuickNote}
            onViewChange={setView}
          />
        )}

        {view === 'NOTES' && (
          <NotesView
            semester={semester}
            setSemester={setSemester}
            visibleUEs={visibleUEs}
            setVisibleUEs={setVisibleUEs}
            s2Grades={s2Grades}
            absences={absences}
            stats={stats}
            history={history}
            onModuleClick={setSelectedModule}
            onAbsenceUpdate={updateAbsence}
            onHistoryUpdate={updateHistory}
          />
        )}

        {view === 'AGENDA' && (
          <AgendaView
            events={allEvents}
            taskStatus={taskStatus}
            onToggle={toggleTask}
            onExpandAgenda={() => setShowFullAgenda(true)}
          />
        )}

        {view === 'LIFE' && <LifeView />}

        {view === 'SETTINGS' && (
          <SettingsView
            profile={profile}
            stats={stats}
            onUpdateProfile={updateProfile}
            onSignOut={signOut}
          />
        )}
      </main>
      <BottomNav active={view} setView={setView} />
    </div>
  );
};

export default StudentApp;
