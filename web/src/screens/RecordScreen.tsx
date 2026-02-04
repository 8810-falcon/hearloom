/**
 * 記録画面（新規登録）
 *
 * 共有メニューから起動し、曲の共有URLが自動反映された状態で開く画面。
 *
 * docs/design/screens.md の仕様に準拠:
 * - ヘッダー: 「← 記録する」（左矢印タップでキャンセル、音楽アプリに戻る）
 * - 曲情報カード: 共有URLを表示
 * - 気分選択: 6つのボタン（単一選択、必須）
 * - 状況入力: 1行テキスト入力（プレースホルダー: 「例: 朝の通勤電車で」、必須）
 * - 保存ボタン: プライマリカラー、気分と状況が入力されたら活性化
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Button, TextInput, ConfirmDialog } from '../components/common';
import { MoodSelector } from '../components/MoodSelector';
import { SongInfoCard } from '../components/SongInfoCard';
import { useRecords } from '../hooks/useRecords';
import { hearloomBridge } from '../bridge';
import type { MoodType } from '../types/record';
import styles from './RecordScreen.module.css';

/**
 * 開発環境かどうか
 */
const isDevelopment = import.meta.env.DEV;

/**
 * サンプルURL一覧（開発用）
 */
const SAMPLE_URLS = [
  { label: 'Spotify', url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT' },
  { label: 'Apple Music', url: 'https://music.apple.com/jp/album/bohemian-rhapsody/1440806041?i=1440806768' },
  { label: 'YouTube', url: 'https://youtu.be/dQw4w9WgXcQ' },
  { label: 'YouTube Music', url: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ' },
];

export const RecordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { create } = useRecords();

  // 入力状態
  const [url, setUrl] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [situation, setSituation] = useState<string>('');

  // UI状態
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  /**
   * 初回マウント時に共有URLを取得
   */
  useEffect(() => {
    const loadSharedUrl = async () => {
      try {
        // まずクエリパラメータをチェック
        const urlParam = searchParams.get('url');
        if (urlParam) {
          setUrl(urlParam);
          setIsLoading(false);
          return;
        }

        // ネイティブブリッジから取得を試みる
        const sharedUrl = await hearloomBridge.getSharedUrl();
        if (sharedUrl) {
          setUrl(sharedUrl);
        } else {
          // URLがない場合は一覧画面に戻る
          console.warn('No shared URL available');
          // 開発時はモックURLを使用
          setUrl('https://spotify.link/development-mode');
        }
      } catch (error) {
        console.error('Failed to get shared URL:', error);
        // 開発時はモックURLを使用
        setUrl('https://spotify.link/development-mode');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedUrl();
  }, [searchParams]);

  /**
   * 入力内容があるかどうか
   */
  const hasInput = selectedMood !== null || situation.trim() !== '';

  /**
   * 保存可能かどうか
   */
  const canSave = selectedMood !== null && situation.trim() !== '' && url !== '';

  /**
   * キャンセルボタンクリック時のハンドラ
   */
  const handleBack = useCallback(() => {
    if (hasInput) {
      setShowCancelDialog(true);
    } else {
      // 入力がなければそのまま戻る
      navigate('/');
    }
  }, [hasInput, navigate]);

  /**
   * キャンセル確認ダイアログで「キャンセル」を選択
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
   * 保存ボタンクリック時のハンドラ
   */
  const handleSave = useCallback(() => {
    if (!canSave || !selectedMood) {
      return;
    }

    try {
      create({
        url,
        mood: selectedMood,
        situation: situation.trim(),
      });

      // 保存成功後、一覧画面に遷移
      navigate('/');
    } catch (error) {
      console.error('Failed to save record:', error);
      // TODO: エラー表示
    }
  }, [canSave, selectedMood, url, situation, create, navigate]);

  /**
   * ローディング表示
   */
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="記録する" showBackButton onBack={handleBack} />
        <div className={styles.loading}>
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="記録する" showBackButton onBack={handleBack} />

      <main className={styles.content}>
        {/* 曲情報カード（開発時はURL入力可能） */}
        <section className={styles.section}>
          {isDevelopment ? (
            <div className={styles.devUrlSection}>
              <label htmlFor="url" className={styles.label}>
                曲のURL <span className={styles.devBadge}>DEV</span>
              </label>
              <TextInput
                id="url"
                value={url}
                onChange={setUrl}
                placeholder="https://open.spotify.com/track/..."
              />
              <div className={styles.sampleButtons}>
                {SAMPLE_URLS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    className={styles.sampleButton}
                    onClick={() => setUrl(sample.url)}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <SongInfoCard url={url} />
          )}
        </section>

        {/* 気分選択 */}
        <section className={styles.section}>
          <MoodSelector
            selectedMood={selectedMood}
            onSelect={setSelectedMood}
            required
          />
        </section>

        {/* 状況入力 */}
        <section className={styles.section}>
          <label htmlFor="situation" className={styles.label}>
            どんな状況？<span className={styles.required}> *必須</span>
          </label>
          <TextInput
            id="situation"
            value={situation}
            onChange={setSituation}
            placeholder="例: 朝の通勤電車で"
            maxLength={100}
            required
          />
        </section>

        {/* 保存ボタン */}
        <section className={styles.buttonSection}>
          <Button fullWidth disabled={!canSave} onClick={handleSave}>
            保存する
          </Button>
        </section>
      </main>

      {/* キャンセル確認ダイアログ */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="入力を破棄しますか？"
        message="入力した内容は保存されません。"
        confirmText="破棄"
        cancelText="戻る"
        onConfirm={handleCancelDialogConfirm}
        onCancel={handleCancelDialogCancel}
        confirmVariant="danger"
      />
    </div>
  );
};
