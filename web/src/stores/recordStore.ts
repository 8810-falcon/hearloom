export type TimeBucket = '朝' | '昼' | '夕' | '夜';

export type RecordEntry = {
  id: string;
  sharedUrl: string;
  mood: string;
  note: string;
  createdAt: string; // ISO
  timeBucket: TimeBucket;
};

const STORAGE_KEY = 'hearloom.records.v1';

export const getTimeBucket = (date: Date): TimeBucket => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return '朝';
  if (hour >= 11 && hour < 15) return '昼';
  if (hour >= 15 && hour < 19) return '夕';
  return '夜';
};

export const formatDateLabel = (iso: string, bucket: TimeBucket): string => {
  const date = new Date(iso);
  const formatted = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  return `${formatted}・${bucket}`;
};

export const loadRecords = (): RecordEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecordEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const saveRecords = (records: RecordEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const sortRecords = (records: RecordEntry[]) =>
  [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const createRecord = (params: {
  sharedUrl: string;
  mood: string;
  note: string;
}): RecordEntry => {
  const now = new Date();
  const createdAt = now.toISOString();
  return {
    id: createId(),
    sharedUrl: params.sharedUrl.trim(),
    mood: params.mood.trim(),
    note: params.note.trim(),
    createdAt,
    timeBucket: getTimeBucket(now),
  };
};

export const updateRecord = (
  record: RecordEntry,
  changes: { sharedUrl: string; mood: string; note: string }
): RecordEntry => ({
  ...record,
  sharedUrl: changes.sharedUrl.trim(),
  mood: changes.mood.trim(),
  note: changes.note.trim(),
});

const createId = (): string => {
  if (crypto && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `hl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};
