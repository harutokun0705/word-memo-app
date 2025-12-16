export type ActivityLog = {
  [dateString: string]: number;
};

const ACTIVITY_KEY = 'word-memo-activity';

export function loadActivityLog(): ActivityLog {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(ACTIVITY_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveActivityLog(log: ActivityLog): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
}

export function recordActivity(date: Date = new Date(), amount: number = 1): void {
  const log = loadActivityLog();
  const key = date.toISOString().split('T')[0];
  log[key] = (log[key] || 0) + amount;
  saveActivityLog(log);
}

export function getTodayActivity(): number {
  const log = loadActivityLog();
  const key = new Date().toISOString().split('T')[0];
  return log[key] || 0;
}
