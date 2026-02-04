import React from 'react';
import { RecordEntry } from '../stores/recordStore';
import RecordCard from './RecordCard';

type Props = {
  records: RecordEntry[];
  onEdit: (entry: RecordEntry) => void;
};

export default function RecordList({ records, onEdit }: Props) {
  return (
    <div className="record-list">
      {records.map((entry, index) => (
        <RecordCard key={entry.id} entry={entry} index={index} onEdit={onEdit} />
      ))}
    </div>
  );
}
