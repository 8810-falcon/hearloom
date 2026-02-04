import React from 'react';
import RecordForm, { RecordFormErrors } from '../components/RecordForm';

type Props = {
  sharedUrl: string;
  mood: string;
  note: string;
  errors: RecordFormErrors;
  onSharedUrlChange: (value: string) => void;
  onMoodChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export default function ShareCaptureScreen({
  sharedUrl,
  mood,
  note,
  errors,
  onSharedUrlChange,
  onMoodChange,
  onNoteChange,
  onSubmit,
  onClear,
}: Props) {
  return (
    <RecordForm
      title="新しい記録"
      subtitle="共有メニューからのURLを貼り付け"
      sharedUrl={sharedUrl}
      mood={mood}
      note={note}
      errors={errors}
      onSharedUrlChange={onSharedUrlChange}
      onMoodChange={onMoodChange}
      onNoteChange={onNoteChange}
      onSubmit={onSubmit}
      onSecondary={onClear}
      primaryLabel="保存"
      secondaryLabel="クリア"
    />
  );
}
