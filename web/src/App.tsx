import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  List,
  ListItem,
  RadioButton,
  RadioGroup,
  TextArea,
  TextField,
} from '@serendie/ui';
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

type ErrorField = '' | 'sharedUrl' | 'mood' | 'note';

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
  const [errorField, setErrorField] = useState<ErrorField>('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorField('');
    setErrorMessage('');
  };

  const handleSave = () => {
    if (!sharedUrl.trim()) {
      setErrorField('sharedUrl');
      setErrorMessage('共有URLが必要です。音楽アプリから共有してください。');
      return;
    }
    if (!mood.trim()) {
      setErrorField('mood');
      setErrorMessage('気分を選択してください。');
      return;
    }
    if (!note.trim()) {
      setErrorField('note');
      setErrorMessage('状況を一言入力してください。');
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
    setErrorField('');
    setErrorMessage('');
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-head">
          <span className="hero-eyebrow">Playlist Mode</span>
          <h1>Hearloom</h1>
          <p>音楽と感情・状況を紐づける記録</p>
        </div>
        <div className="hero-stats">
          <Badge>Share MVP</Badge>
          <Badge>{sortedRecords.length} Records</Badge>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="panel-header">
            <h2>{editingId ? '記録を編集' : '新しい記録'}</h2>
            <span className="panel-sub">共有メニューからのURLを貼り付け</span>
          </div>

          <div className="stack">
            <TextField
              label="共有URL"
              placeholder="共有されたURLが自動反映されます"
              description="音楽アプリの共有メニューから開くと自動入力されます"
              required
              value={sharedUrl}
              onChange={(event) => setSharedUrl(event.target.value)}
              invalid={errorField === 'sharedUrl'}
              invalidMessage={
                errorField === 'sharedUrl' ? errorMessage : undefined
              }
            />

            <div className="field-block">
              <div className="field-title">
                <span>気分</span>
                <span className="field-required">必須</span>
              </div>
              <RadioGroup
                value={mood}
                onValueChange={(details) => {
                  setMood(details.value ?? '');
                  if (errorField === 'mood') {
                    setErrorField('');
                    setErrorMessage('');
                  }
                }}
                orientation="horizontal"
                invalid={errorField === 'mood'}
              >
                <div className="mood-grid">
                  {MOOD_OPTIONS.map((option) => (
                    <RadioButton key={option} value={option} label={option} />
                  ))}
                </div>
              </RadioGroup>
              {errorField === 'mood' && (
                <p className="field-error">{errorMessage}</p>
              )}
            </div>

            <TextArea
              label="状況（必須）"
              placeholder="例: 通勤中に聴いて集中できた"
              autoAdjustHeight
              required
              value={note}
              onChange={(event) => setNote(event.target.value)}
              invalid={errorField === 'note'}
              invalidMessage={errorField === 'note' ? errorMessage : undefined}
            />
          </div>

          <div className="actions">
            <Button size="medium" styleType="filled" onClick={handleSave}>
              {editingId ? '更新する' : '保存する'}
            </Button>
            <Button size="medium" styleType="outlined" onClick={resetForm}>
              クリア
            </Button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>最近の記録</h2>
            <span className="panel-sub">{sortedRecords.length}件</span>
          </div>

          {sortedRecords.length === 0 ? (
            <div className="empty-state">
              <p>まだ記録がありません。</p>
              <p>音楽アプリの共有メニューからHearloomを開いてください。</p>
            </div>
          ) : (
            <List>
              {sortedRecords.map((entry, index) => (
                <ListItem
                  key={entry.id}
                  title={`#${String(index + 1).padStart(2, '0')}  ${entry.mood}`}
                  description={entry.note}
                >
                  <div className="record-meta">
                    <span>{formatDateLabel(entry.createdAt, entry.timeBucket)}</span>
                    <Button size="small" styleType="ghost" onClick={() => handleEdit(entry)}>
                      編集
                    </Button>
                  </div>
                  <a
                    className="record-url"
                    href={entry.sharedUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {entry.sharedUrl}
                  </a>
                </ListItem>
              ))}
            </List>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
