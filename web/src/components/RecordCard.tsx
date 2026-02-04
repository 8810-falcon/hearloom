import React from 'react';
import { RecordEntry, formatDateLabel } from '../stores/recordStore';

type Props = {
  entry: RecordEntry;
  index: number;
  onEdit: (entry: RecordEntry) => void;
};

export default function RecordCard({ entry, index, onEdit }: Props) {
  return (
    <article className="record-card">
      <div className="record-header">
        <div>
          <span className="record-index">#{String(index + 1).padStart(2, '0')}</span>
          <span className="record-mood">{entry.mood}</span>
        </div>
        <button className="link-button" onClick={() => onEdit(entry)}>
          編集
        </button>
      </div>
      <p className="record-note">{entry.note}</p>
      <div className="record-meta">
        <span>{formatDateLabel(entry.createdAt, entry.timeBucket)}</span>
      </div>
      <a className="record-url" href={entry.sharedUrl} target="_blank" rel="noreferrer">
        {entry.sharedUrl}
      </a>
    </article>
  );
}
