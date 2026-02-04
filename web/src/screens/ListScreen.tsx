/**
 * 一覧画面（ホーム）
 *
 * アプリを直接起動した際のホーム画面。
 * 過去の記録を日付順（最新順）で表示します。
 *
 * docs/design/screens.md の仕様に準拠:
 * - ヘッダー: 「Hearloom」（アプリ名、固定）
 * - 日付セクション: 「YYYY年M月D日（曜日）時間帯」でグルーピング
 * - 記録カード: 気分（アイコン付き）+ URL + 状況の一言
 * - 空状態: 記録がない場合のメッセージ表示
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components/common';
import { RecordCard } from '../components/RecordCard';
import { useRecords } from '../hooks/useRecords';
import { formatDateWithTimeOfDay } from '../utils/dateUtils';
import type { Record } from '../types/record';
import styles from './ListScreen.module.css';

/**
 * 開発環境かどうか
 */
const isDevelopment = import.meta.env.DEV;

/**
 * 記録を日付セクションでグルーピング
 */
interface RecordGroup {
  sectionTitle: string;
  records: Record[];
}

const groupRecordsByDateSection = (records: Record[]): RecordGroup[] => {
  const groups: RecordGroup[] = [];
  let currentGroup: RecordGroup | null = null;

  for (const record of records) {
    const sectionTitle = formatDateWithTimeOfDay(record.createdAt);

    if (!currentGroup || currentGroup.sectionTitle !== sectionTitle) {
      currentGroup = {
        sectionTitle,
        records: [],
      };
      groups.push(currentGroup);
    }

    currentGroup.records.push(record);
  }

  return groups;
};

export const ListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { records, isLoading, error } = useRecords();

  /**
   * 記録を日付セクションでグルーピング
   */
  const recordGroups = useMemo(() => {
    return groupRecordsByDateSection(records);
  }, [records]);

  /**
   * 記録カードクリック時のハンドラ
   */
  const handleRecordClick = (recordId: string) => {
    navigate(`/edit/${recordId}`);
  };

  /**
   * 新規記録ボタンクリック時のハンドラ（開発用）
   */
  const handleAddRecord = () => {
    navigate('/record');
  };

  /**
   * ローディング表示
   */
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="Hearloom" />
        <div className={styles.loading}>
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  /**
   * エラー表示
   */
  if (error) {
    return (
      <div className={styles.container}>
        <Header title="Hearloom" />
        <div className={styles.error}>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  /**
   * 空状態表示
   */
  if (records.length === 0) {
    return (
      <div className={styles.container}>
        <Header title="Hearloom" />
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>♪</span>
          <p className={styles.emptyText}>
            まだ記録がありません。
            <br />
            音楽アプリから共有してみましょう
          </p>
          {isDevelopment && (
            <Button onClick={handleAddRecord} className={styles.devButton}>
              + テスト記録を追加
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="Hearloom" />
      <main className={styles.content}>
        {recordGroups.map((group) => (
          <section key={group.sectionTitle} className={styles.section}>
            <h2 className={styles.sectionTitle}>{group.sectionTitle}</h2>
            <div className={styles.cardList}>
              {group.records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onClick={() => handleRecordClick(record.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* 開発用: 新規記録追加ボタン（FAB） */}
      {isDevelopment && (
        <button
          className={styles.fab}
          onClick={handleAddRecord}
          aria-label="新規記録を追加"
        >
          +
        </button>
      )}
    </div>
  );
};
