import React from 'react';
import MoodPicker from './MoodPicker';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import TextArea from './TextArea';
import TextField from './TextField';

export type RecordFormErrors = {
  sharedUrl?: string;
  mood?: string;
  note?: string;
};

type Props = {
  title: string;
  subtitle: string;
  sharedUrl: string;
  mood: string;
  note: string;
  errors: RecordFormErrors;
  onSharedUrlChange: (value: string) => void;
  onMoodChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onSecondary: () => void;
  primaryLabel: string;
  secondaryLabel: string;
};

export default function RecordForm({
  title,
  subtitle,
  sharedUrl,
  mood,
  note,
  errors,
  onSharedUrlChange,
  onMoodChange,
  onNoteChange,
  onSubmit,
  onSecondary,
  primaryLabel,
  secondaryLabel,
}: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          <p className="panel-sub">{subtitle}</p>
        </div>
      </div>

      <div className="stack">
        <TextField
          label="共有URL"
          placeholder="共有されたURLが自動反映されます"
          helper="音楽アプリの共有メニューから開くと自動入力されます"
          value={sharedUrl}
          onChange={onSharedUrlChange}
          error={errors.sharedUrl}
        />
        <MoodPicker value={mood} onChange={onMoodChange} error={errors.mood} />
        <TextArea
          label="状況を一言"
          placeholder="例: 通勤中に聴いて集中できた"
          value={note}
          onChange={onNoteChange}
          error={errors.note}
        />
      </div>

      <div className="actions">
        <PrimaryButton label={primaryLabel} onClick={onSubmit} />
        <SecondaryButton label={secondaryLabel} onClick={onSecondary} />
      </div>
    </section>
  );
}
