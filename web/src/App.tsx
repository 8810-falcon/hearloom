import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

type TimeBucket = '朝' | '昼' | '夕' | '夜';

type RecordEntry = {
  id: string;
  sharedUrl: string;
  mood: string;
  note: string;
  createdAt: string; // ISO
  timeBucket: TimeBucket;
};

const MOOD_OPTIONS = [
  '嬉しい',
  '落ち着く',
  '集中',
  'エネルギッシュ',
  '切ない',
  '懐かしい',
  '高揚',
  'リラックス',
];

const STORAGE_KEY = 'hearloom.records.v1';

const getTimeBucket = (date: Date): TimeBucket => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return '朝';
  if (hour >= 11 && hour < 15) return '昼';
  if (hour >= 15 && hour < 19) return '夕';
  return '夜';
};

const formatDateLabel = (iso: string, bucket: TimeBucket): string => {
  const date = new Date(iso);
  const formatted = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  return `${formatted}・${bucket}`;
};

const loadRecords = (): RecordEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecordEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn('Failed to load records', error);
    return [];
  }
};

const saveRecords = (records: RecordEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const getSharedUrlFromLocation = (): string => {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get('sharedUrl') ||
    params.get('url') ||
    params.get('text') ||
    ''
  );
};

const createId = (): string => {
  if (crypto && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `hl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

function App() {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [sharedUrl, setSharedUrl] = useState('');
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const initial = loadRecords();
    setRecords(initial);
    setSharedUrl(getSharedUrlFromLocation());
  }, []);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }, [records]);

  const resetForm = () => {
    setMood('');
    setNote('');
    setEditingId(null);
    setError('');
  };

  const handleSave = () => {
    if (!sharedUrl.trim()) {
      setError('共有URLが必要です。音楽アプリから共有してください。');
      return;
    }
    if (!mood.trim()) {
      setError('気分を選択してください。');
      return;
    }
    if (!note.trim()) {
      setError('状況を一言入力してください。');
      return;
    }

    const now = new Date();
    const createdAt = now.toISOString();
    const timeBucket = getTimeBucket(now);

    if (editingId) {
      const updated = records.map((record) =>
        record.id === editingId
          ? { ...record, sharedUrl, mood, note }
          : record
      );
      setRecords(updated);
      saveRecords(updated);
      resetForm();
      return;
    }

    const entry: RecordEntry = {
      id: createId(),
      sharedUrl: sharedUrl.trim(),
      mood: mood.trim(),
      note: note.trim(),
      createdAt,
      timeBucket,
    };

    const updated = [entry, ...records];
    setRecords(updated);
    saveRecords(updated);
    resetForm();
  };

  const handleEdit = (entry: RecordEntry) => {
    setEditingId(entry.id);
    setSharedUrl(entry.sharedUrl);
    setMood(entry.mood);
    setNote(entry.note);
    setError('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">H</span>
          <div>
            <h1>Hearloom</h1>
            <p>音楽と感情・状況を紐づける記録</p>
          </div>
        </div>
        <div className="header-note">
          共有メニューから来たURLをそのまま記録します
        </div>
      </header>

      <main className="app-main">
        <section className="panel form-panel">
          <h2>{editingId ? '記録を編集' : '新しい記録'}</h2>
          <label className="field">
            <span>共有URL</span>
            <input
              type="text"
              value={sharedUrl}
              onChange={(event) => setSharedUrl(event.target.value)}
              placeholder="共有されたURLが自動反映されます"
            />
          </label>

          <label className="field">
            <span>気分</span>
            <div className="mood-grid">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    option === mood ? 'mood-chip active' : 'mood-chip'
                  }
                  onClick={() => setMood(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>

          <label className="field">
            <span>状況（必須）</span>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="例: 通勤中に聴いて集中できた"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="primary" type="button" onClick={handleSave}>
              {editingId ? '更新する' : '保存する'}
            </button>
            <button
              className="ghost"
              type="button"
              onClick={resetForm}
            >
              クリア
            </button>
          </div>
        </section>

        <section className="panel list-panel">
          <div className="list-header">
            <h2>最近の記録</h2>
            <span className="count">{sortedRecords.length}件</span>
          </div>

          {sortedRecords.length === 0 ? (
            <div className="empty-state">
              <p>まだ記録がありません。</p>
              <p>音楽アプリの共有メニューからHearloomを開いてください。</p>
            </div>
          ) : (
            <ul className="record-list">
              {sortedRecords.map((entry) => (
                <li key={entry.id} className="record-card">
                  <div className="record-meta">
                    <span className="record-date">
                      {formatDateLabel(entry.createdAt, entry.timeBucket)}
                    </span>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => handleEdit(entry)}
                    >
                      編集
                    </button>
                  </div>
                  <div className="record-body">
                    <div className="record-mood">{entry.mood}</div>
                    <p className="record-note">{entry.note}</p>
                    <a
                      className="record-url"
                      href={entry.sharedUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.sharedUrl}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
