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
  onCancel: () => void;
};

export default function EditScreen({
  sharedUrl,
  mood,
  note,
  errors,
  onSharedUrlChange,
  onMoodChange,
  onNoteChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <RecordForm
      title="記録を編集"
      subtitle="内容を更新して保存"
      sharedUrl={sharedUrl}
      mood={mood}
      note={note}
      errors={errors}
      onSharedUrlChange={onSharedUrlChange}
      onMoodChange={onMoodChange}
      onNoteChange={onNoteChange}
      onSubmit={onSubmit}
      onSecondary={onCancel}
      primaryLabel="更新"
      secondaryLabel="キャンセル"
    />
  );
}
