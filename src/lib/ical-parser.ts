export interface CalendarEvent {
  summary: string;
  location: string;
  start: Date;
  end: Date;
}

export const parseICS = (icsData: string): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const lines = icsData.split(/\r\n|\n|\r/);
  let inEvent = false;
  let event: Partial<CalendarEvent> = {};

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    dateStr = dateStr.trim();
    const match = dateStr.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?/);
    if (!match) return null;
    const [, y, m, d, h, min, s, z] = match;
    if (z) return new Date(Date.UTC(+y, +m - 1, +d, +h, +min, +s));
    return new Date(+y, +m - 1, +d, +h, +min, +s);
  };

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      event = {};
    } else if (line.startsWith('END:VEVENT')) {
      inEvent = false;
      if (event.start && event.summary) events.push(event as CalendarEvent);
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const parts = line.split(':');
        if (parts.length > 1) event.start = parseDate(parts[1]) || undefined;
      } else if (line.startsWith('DTEND')) {
        const parts = line.split(':');
        if (parts.length > 1) event.end = parseDate(parts[1]) || undefined;
      } else if (line.startsWith('SUMMARY')) {
        event.summary = line.split(':')[1]?.replace(/\\,/g, ',') || 'Cours';
      } else if (line.startsWith('LOCATION')) {
        event.location = line.split(':')[1]?.replace(/\\,/g, ',') || '';
      }
    }
  }
  return events;
};

export const generateDemoSchedule = (): string => {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay() + 1;
  const currentMonday = new Date(curr.setDate(first));
  let vcal = `BEGIN:VCALENDAR\n`;

  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(currentMonday);
    dayDate.setDate(currentMonday.getDate() + i);
    const dayStr = `${dayDate.getFullYear()}${(dayDate.getMonth() + 1).toString().padStart(2, '0')}${dayDate.getDate().toString().padStart(2, '0')}`;
    vcal += `BEGIN:VEVENT\nDTSTART:${dayStr}T080000\nDTEND:${dayStr}T100000\nSUMMARY:Cours Magistral (Démo)\nLOCATION:Amphi\nEND:VEVENT\n`;
    vcal += `BEGIN:VEVENT\nDTSTART:${dayStr}T140000\nDTEND:${dayStr}T160000\nSUMMARY:Travaux Pratiques (Démo)\nLOCATION:Salle TP\nEND:VEVENT\n`;
  }
  vcal += `END:VCALENDAR`;
  return vcal;
};
