/**
 * 記録画面（新コンセプト）
 *
 * ウィジェットタップ → アプリ起動 → 今聴いている曲が自動表示
 * 気分を選ぶ（必須）+ 一言（任意）
 * エピソード（曲の裏話・豆知識）がAIで生成され表示（即時報酬）
 * 記録完了
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, TextInput, ConfirmDialog } from '../components/common';
import { MoodSelector } from '../components/MoodSelector';
import { SongInfoCard } from '../components/SongInfoCard';
import { bridge } from '../bridge';
import type { Song, MoodType, EpisodeResult } from '../bridge/types';
import styles from './RecordScreen.module.css';

/** 記録フローのステップ */
type RecordStep = 'loading' | 'input' | 'generating' | 'episode' | 'saving' | 'complete';

export const RecordScreen: React.FC = () => {
  const navigate = useNavigate();

  // 曲情報
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // 入力状態
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [situation, setSituation] = useState<string>('');

  // エピソード
  const [episodeResult, setEpisodeResult] = useState<EpisodeResult | null>(null);

  // UI状態
  const [step, setStep] = useState<RecordStep>('loading');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 初回マウント時に再生中の曲を取得
   */
  useEffect(() => {
    const loadCurrentSong = async () => {
      try {
        const song = await bridge.getCurrentSong();
        if (song) {
          setCurrentSong(song);
          setStep('input');
        } else {
          setError('再生中の曲が見つかりません。音楽を再生してからもう一度お試しください。');
          setStep('input');
        }
      } catch (err) {
        console.error('Failed to get current song:', err);
        setError('曲情報の取得に失敗しました。');
        setStep('input');
      }
    };

    loadCurrentSong();
  }, []);

  /**
   * 入力内容があるかどうか
   */
  const hasInput = selectedMood !== null || situation.trim() !== '';

  /**
   * エピソード生成可能かどうか（気分が選択されていれば可）
   */
  const canGenerateEpisode = selectedMood !== null && currentSong !== null;

  /**
   * キャンセルボタンクリック時のハンドラ
   */
  const handleBack = useCallback(() => {
    if (hasInput) {
      setShowCancelDialog(true);
    } else {
      bridge.closeApp();
    }
  }, [hasInput]);

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
    bridge.closeApp();
  }, []);

  /**
   * エピソード生成ボタンクリック時のハンドラ
   */
  const handleGenerateEpisode = useCallback(async () => {
    if (!canGenerateEpisode || !currentSong) {
      return;
    }

    setStep('generating');
    bridge.triggerHapticFeedback('light');

    try {
      const result = await bridge.generateEpisode(currentSong);
      setEpisodeResult(result);
      setStep('episode');
    } catch (err) {
      console.error('Failed to generate episode:', err);
      setEpisodeResult({ found: false, errorCode: 'TIMEOUT' });
      setStep('episode');
    }
  }, [canGenerateEpisode, currentSong]);

  /**
   * 保存ボタンクリック時のハンドラ
   */
  const handleSave = useCallback(async () => {
    if (!selectedMood || !currentSong) {
      return;
    }

    setStep('saving');
    bridge.triggerHapticFeedback('medium');

    try {
      const result = await bridge.saveRecord({
        song: currentSong,
        mood: selectedMood,
        situation: situation.trim() || undefined,
        episode: episodeResult?.episode,
      });

      if (result.success) {
        setStep('complete');
        // 少し待ってから一覧画面に遷移
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('保存に失敗しました。もう一度お試しください。');
        setStep('episode');
      }
    } catch (err) {
      console.error('Failed to save record:', err);
      setError('保存に失敗しました。');
      setStep('episode');
    }
  }, [selectedMood, currentSong, situation, episodeResult, navigate]);

  /**
   * ローディング表示
   */
  if (step === 'loading') {
    return (
      <div className={styles.container}>
        <Header title="記録する" showBackButton onBack={handleBack} />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>曲情報を取得中...</span>
        </div>
      </div>
    );
  }

  /**
   * 完了表示
   */
  if (step === 'complete') {
    return (
      <div className={styles.container}>
        <Header title="記録する" />
        <div className={styles.complete}>
          <div className={styles.checkmark}>✓</div>
          <span>記録しました！</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="記録する" showBackButton onBack={handleBack} />

      <main className={styles.content}>
        {/* エラー表示 */}
        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        {/* 曲情報カード */}
        <section className={styles.section}>
          {currentSong ? (
            <SongInfoCard song={currentSong} />
          ) : (
            <div className={styles.noSongCard}>
              <p>再生中の曲がありません</p>
              <p className={styles.hint}>音楽を再生してからもう一度お試しください</p>
            </div>
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

        {/* エピソード表示エリア */}
        {step === 'generating' && (
          <section className={styles.section}>
            <div className={styles.episodeLoading}>
              <div className={styles.spinner} />
              <span>エピソードを探しています...</span>
            </div>
          </section>
        )}

        {step === 'episode' && episodeResult && (
          <section className={styles.section}>
            <div className={styles.episodeCard}>
              <h3 className={styles.episodeTitle}>
                {episodeResult.found ? '💡 この曲のエピソード' : '📝 エピソード'}
              </h3>
              {episodeResult.found && episodeResult.episode ? (
                <p className={styles.episodeText}>{episodeResult.episode}</p>
              ) : (
                <p className={styles.episodeNotFound}>
                  この曲のエピソードは見つかりませんでした。
                  <br />
                  代わりに一言メモを残してみませんか？
                </p>
              )}
            </div>
          </section>
        )}

        {/* ボタンエリア */}
        <section className={styles.buttonSection}>
          {step === 'input' && (
            <Button
              fullWidth
              disabled={!canGenerateEpisode}
              onClick={handleGenerateEpisode}
            >
              エピソードを見る
            </Button>
          )}

          {(step === 'episode' || step === 'saving') && (
            <Button
              fullWidth
              onClick={handleSave}
              disabled={step === 'saving'}
            >
              {step === 'saving' ? '保存中...' : '記録する'}
            </Button>
          )}
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
