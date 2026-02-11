/**
 * 記録データのカスタムフック
 *
 * Bridge API経由でNative側のデータを操作するためのフックです。
 * 新コンセプト（Song型ベース、MusicRecord型）に対応。
 */

import { useState, useCallback, useEffect } from 'react';
import { bridge } from '../bridge';
import type {
  MusicRecord,
  MusicRecordInput,
  MusicRecordUpdate,
  MusicRecordFilter,
} from '../bridge/types';

/**
 * useRecordsフックの戻り値
 */
export interface UseRecordsResult {
  /** すべての記録（新しい順） */
  records: MusicRecord[];
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 記録を再読み込み */
  refresh: () => Promise<void>;
  /** 新しい記録を作成 */
  create: (input: MusicRecordInput) => Promise<MusicRecord | null>;
  /** 記録を更新 */
  update: (id: string, data: MusicRecordUpdate) => Promise<boolean>;
  /** 記録を削除 */
  remove: (id: string) => Promise<boolean>;
  /** IDで記録を取得 */
  getById: (id: string) => MusicRecord | undefined;
}

/**
 * 記録データを管理するカスタムフック
 */
export const useRecords = (filter?: MusicRecordFilter): UseRecordsResult => {
  const [records, setRecords] = useState<MusicRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Bridge APIから記録を読み込み
   */
  const loadRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bridge.getRecords(filter);
      setRecords(data);
    } catch (err) {
      setError('記録の読み込みに失敗しました');
      console.error('Failed to load records:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  /**
   * 初回マウント時に読み込み
   */
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  /**
   * 記録を再読み込み
   */
  const refresh = useCallback(async () => {
    await loadRecords();
  }, [loadRecords]);

  /**
   * 新しい記録を作成
   */
  const create = useCallback(
    async (input: MusicRecordInput): Promise<MusicRecord | null> => {
      try {
        const result = await bridge.saveRecord(input);
        if (result.success && result.data) {
          // 作成成功したら一覧を再取得
          await loadRecords();
          // 作成した記録を返す
          const newRecord = await bridge.getRecord(result.data.id);
          return newRecord;
        }
        return null;
      } catch (err) {
        console.error('Failed to create record:', err);
        return null;
      }
    },
    [loadRecords]
  );

  /**
   * 記録を更新
   */
  const update = useCallback(
    async (id: string, data: MusicRecordUpdate): Promise<boolean> => {
      try {
        const result = await bridge.updateRecord(id, data);
        if (result.success) {
          // 更新成功したら一覧を再取得
          await loadRecords();
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to update record:', err);
        return false;
      }
    },
    [loadRecords]
  );

  /**
   * 記録を削除
   */
  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await bridge.deleteRecord(id);
        if (result.success) {
          // 削除成功したらローカル状態を更新
          setRecords((prev) => prev.filter((r) => r.id !== id));
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to delete record:', err);
        return false;
      }
    },
    []
  );

  /**
   * IDで記録を取得（キャッシュから）
   */
  const getById = useCallback(
    (id: string): MusicRecord | undefined => {
      return records.find((r) => r.id === id);
    },
    [records]
  );

  return {
    records,
    isLoading,
    error,
    refresh,
    create,
    update,
    remove,
    getById,
  };
};

/**
 * 単一の記録を取得するカスタムフック
 * @param id 記録ID
 */
export const useRecord = (
  id: string | null
): {
  record: MusicRecord | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} => {
  const [record, setRecord] = useState<MusicRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecord = useCallback(async () => {
    if (!id) {
      setRecord(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await bridge.getRecord(id);
      setRecord(data);
    } catch (err) {
      setError('記録の読み込みに失敗しました');
      console.error('Failed to load record:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const refresh = useCallback(async () => {
    await loadRecord();
  }, [loadRecord]);

  return { record, isLoading, error, refresh };
};
