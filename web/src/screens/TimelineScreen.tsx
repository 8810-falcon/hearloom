import React from 'react';
import RecordList from '../components/RecordList';
import { RecordEntry } from '../stores/recordStore';

type Props = {
  records: RecordEntry[];
  onEdit: (entry: RecordEntry) => void;
};

export default function TimelineScreen({ records, onEdit }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>最近の記録</h2>
          <p className="panel-sub">{records.length}件</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">まだ記録がありません</p>
          <p className="empty-sub">
            音楽アプリの共有メニューからHearloomを開いてください
          </p>
        </div>
      ) : (
        <RecordList records={records} onEdit={onEdit} />
      )}
    </section>
  );
}
