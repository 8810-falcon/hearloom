import React from 'react';

const DEFAULT_MOODS = [
  '嬉しい',
  '落ち着く',
  '集中',
  'エネルギッシュ',
  '切ない',
  '懐かしい',
  '高揚',
  'リラックス',
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  moods?: string[];
};

export default function MoodPicker({ value, onChange, error, moods }: Props) {
  const items = moods ?? DEFAULT_MOODS;
  return (
    <div className="field">
      <div className="field-title">
        <span>今の気分</span>
        <span className="field-required">必須</span>
      </div>
      <div className="mood-grid">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={value === item ? 'mood-chip is-active' : 'mood-chip'}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
