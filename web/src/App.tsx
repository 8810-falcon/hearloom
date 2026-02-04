import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { getSharedUrlFromLocation } from './bridge/share';
import {
  RecordEntry,
  createRecord,
  loadRecords,
  saveRecords,
  sortRecords,
  updateRecord,
} from './stores/recordStore';
import ShareCaptureScreen from './screens/ShareCaptureScreen';
import TimelineScreen from './screens/TimelineScreen';
import EditScreen from './screens/EditScreen';
import { RecordFormErrors } from './components/RecordForm';

type ViewMode = 'share' | 'timeline' | 'edit';

const initialErrors: RecordFormErrors = {};

function App() {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [sharedUrl, setSharedUrl] = useState('');
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<RecordFormErrors>(initialErrors);
  const [view, setView] = useState<ViewMode>('timeline');
  const [editing, setEditing] = useState<RecordEntry | null>(null);

  useEffect(() => {
    const initial = loadRecords();
    setRecords(initial);
    const shared = getSharedUrlFromLocation();
    if (shared) {
      setSharedUrl(shared);
      setView('share');
    }
  }, []);

  const sortedRecords = useMemo(() => sortRecords(records), [records]);

  const resetForm = () => {
    setMood('');
    setNote('');
    setErrors(initialErrors);
  };

  const validate = (): boolean => {
    const nextErrors: RecordFormErrors = {};
    if (!sharedUrl.trim()) {
      nextErrors.sharedUrl = '音楽アプリの共有から開いてください';
    }
    if (!mood.trim()) {
      nextErrors.mood = '気分を選択してください';
    }
    if (!note.trim()) {
      nextErrors.note = '状況を一言で入力してください';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const entry = createRecord({ sharedUrl, mood, note });
    const updated = [entry, ...records];
    setRecords(updated);
    saveRecords(updated);
    resetForm();
    setView('timeline');
  };

  const handleUpdate = () => {
    if (!editing) return;
    if (!validate()) return;
    const updatedEntry = updateRecord(editing, { sharedUrl, mood, note });
    const updated = records.map((record) =>
      record.id === editing.id ? updatedEntry : record
    );
    setRecords(updated);
    saveRecords(updated);
    setEditing(null);
    resetForm();
    setView('timeline');
  };

  const handleEdit = (entry: RecordEntry) => {
    setEditing(entry);
    setSharedUrl(entry.sharedUrl);
    setMood(entry.mood);
    setNote(entry.note);
    setErrors(initialErrors);
    setView('edit');
  };

  const handleClear = () => {
    resetForm();
  };

  const handleCancelEdit = () => {
    setEditing(null);
    resetForm();
    setView('timeline');
  };

  const onSharedUrlChange = (value: string) => {
    setSharedUrl(value);
    if (errors.sharedUrl) {
      setErrors({ ...errors, sharedUrl: undefined });
    }
  };

  const onMoodChange = (value: string) => {
    setMood(value);
    if (errors.mood) {
      setErrors({ ...errors, mood: undefined });
    }
  };

  const onNoteChange = (value: string) => {
    setNote(value);
    if (errors.note) {
      setErrors({ ...errors, note: undefined });
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="hero-eyebrow">Share MVP</p>
          <h1>Hearloom</h1>
          <p className="hero-sub">音楽と感情・状況を紐づける記録</p>
        </div>
        <div className="hero-stats">
          <span className="pill">{sortedRecords.length} Records</span>
          <span className="pill">Warm memory</span>
        </div>
      </header>

      <main className="content">
        {view === 'share' && (
          <ShareCaptureScreen
            sharedUrl={sharedUrl}
            mood={mood}
            note={note}
            errors={errors}
            onSharedUrlChange={onSharedUrlChange}
            onMoodChange={onMoodChange}
            onNoteChange={onNoteChange}
            onSubmit={handleSave}
            onClear={handleClear}
          />
        )}

        {view === 'edit' && (
          <EditScreen
            sharedUrl={sharedUrl}
            mood={mood}
            note={note}
            errors={errors}
            onSharedUrlChange={onSharedUrlChange}
            onMoodChange={onMoodChange}
            onNoteChange={onNoteChange}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdit}
          />
        )}

        {view === 'timeline' && (
          <TimelineScreen records={sortedRecords} onEdit={handleEdit} />
        )}
      </main>
    </div>
  );
}

export default App;
