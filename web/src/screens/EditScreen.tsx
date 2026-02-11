/**
 * 編集画面
 *
 * 一覧画面から記録をタップして遷移。既存記録の編集・削除が可能。
 * 新コンセプト（Song型ベース、MusicRecord型）に対応。
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Button, TextInput, ConfirmDialog } from '../components/common';
import { MoodSelector } from '../components/MoodSelector';
import { SongInfoCard } from '../components/SongInfoCard';
import { useRecords, useRecord } from '../hooks/useRecords';
import { formatDateWithTimeOfDay } from '../utils/dateUtils';
import type { MoodType } from '../bridge/types';
import styles from './EditScreen.module.css';

export const EditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { record, isLoading, error } = useRecord(id || null);
  const { update, remove } = useRecords();

  // 編集状態
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [situation, setSituation] = useState<string>('');

  // UI状態
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 記録データを読み込んだら編集状態を初期化
   */
  useEffect(() => {
    if (record) {
      setSelectedMood(record.mood);
      setSituation(record.situation || '');
    }
  }, [record]);

  /**
   * 変更があるかどうか
   */
  const hasChanges = useMemo(() => {
    if (!record) return false;
    return selectedMood !== record.mood || situation !== (record.situation || '');
  }, [record, selectedMood, situation]);

  /**
   * 保存可能かどうか（気分は必須、一言は任意）
   */
  const canSave = hasChanges && selectedMood !== null;

  /**
   * 戻るボタンクリック時のハンドラ
   */
  const handleBack = useCallback(() => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      navigate('/');
    }
  }, [hasChanges, navigate]);

  /**
   * キャンセル確認ダイアログで「戻る」を選択
   */
  const handleCancelDialogCancel = useCallback(() => {
    setShowCancelDialog(false);
  }, []);

  /**
   * キャンセル確認ダイアログで「破棄」を選択
   */
  const handleCancelDialogConfirm = useCallback(() => {
    setShowCancelDialog(false);
    navigate('/');
  }, [navigate]);

  /**
   * 削除ボタンクリック時のハンドラ
   */
  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  /**
   * 削除確認ダイアログで「キャンセル」を選択
   */
  const handleDeleteDialogCancel = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  /**
   * 削除確認ダイアログで「削除」を選択
   */
  const handleDeleteDialogConfirm = useCallback(async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const success = await remove(id);
      if (success) {
        setShowDeleteDialog(false);
        navigate('/');
      } else {
        console.error('Failed to delete record');
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [id, remove, navigate]);

  /**
   * 保存ボタンクリック時のハンドラ
   */
  const handleSave = useCallback(async () => {
    if (!canSave || !id || !selectedMood) {
      return;
    }

    setIsSaving(true);
    try {
      const success = await update(id, {
        mood: selectedMood,
        situation: situation.trim() || undefined,
      });

      if (success) {
        navigate('/');
      } else {
        console.error('Failed to update record');
      }
    } catch (error) {
      console.error('Failed to update record:', error);
    } finally {
      setIsSaving(false);
    }
  }, [canSave, id, selectedMood, situation, update, navigate]);

  /**
   * ローディング表示
   */
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="編集" showBackButton onBack={handleBack} />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  /**
   * エラー表示（記録が見つからない場合を含む）
   */
  if (error || !record) {
    return (
      <div className={styles.container}>
        <Header title="編集" showBackButton onBack={() => navigate('/')} />
        <div className={styles.error}>
          <span>{error || '記録が見つかりませんでした'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header
        title="編集"
        showBackButton
        onBack={handleBack}
        rightAction="削除"
        onRightAction={handleDeleteClick}
        rightActionVariant="danger"
      />

      <main className={styles.content}>
        {/* 記録日時 */}
        <section className={styles.section}>
          <div className={styles.dateTime}>
            {formatDateWithTimeOfDay(record.createdAt)}
          </div>
        </section>

        {/* 曲情報カード */}
        <section className={styles.section}>
          <SongInfoCard song={record.song} />
        </section>

        {/* エピソード表示（あれば） */}
        {record.episode && (
          <section className={styles.section}>
            <div className={styles.episodeCard}>
              <h3 className={styles.episodeTitle}>💡 この曲のエピソード</h3>
              <p className={styles.episodeText}>{record.episode}</p>
            </div>
          </section>
        )}

        {/* 気分選択 */}
        <section className={styles.section}>
          <MoodSelector
            selectedMood={selectedMood}
            onSelect={setSelectedMood}
            required
          />
        </section>

        {/* 状況入力（任意） */}
        <section className={styles.section}>
          <label htmlFor="situation" className={styles.label}>
            一言メモ<span className={styles.optional}> （任意）</span>
          </label>
          <TextInput
            id="situation"
            value={situation}
            onChange={setSituation}
            placeholder="例: 帰り道、ふと聴きたくなった"
            maxLength={100}
          />
        </section>

        {/* 保存ボタン */}
        <section className={styles.buttonSection}>
          <Button
            fullWidth
            disabled={!canSave || isSaving}
            onClick={handleSave}
          >
            {isSaving ? '保存中...' : '保存する'}
          </Button>
        </section>
      </main>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="この記録を削除しますか？"
        message="削除した記録は元に戻せません。"
        confirmText={isDeleting ? '削除中...' : '削除'}
        cancelText="キャンセル"
        onConfirm={handleDeleteDialogConfirm}
        onCancel={handleDeleteDialogCancel}
        confirmVariant="danger"
      />

      {/* キャンセル確認ダイアログ */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="変更を破棄しますか？"
        message="変更した内容は保存されません。"
        confirmText="破棄"
        cancelText="戻る"
        onConfirm={handleCancelDialogConfirm}
        onCancel={handleCancelDialogCancel}
        confirmVariant="danger"
      />
    </div>
  );
};
