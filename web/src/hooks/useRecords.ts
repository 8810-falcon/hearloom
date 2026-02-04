/**
 * 記録データのカスタムフック
 *
 * コンポーネントから記録データを操作するためのフックです。
 * LocalStorageへの永続化を抽象化し、CRUD操作を提供します。
 */

import { useState, useCallback, useEffect } from 'react';
import type { Record, RecordInput, RecordUpdate } from '../types/record';
import * as recordStore from '../stores/recordStore';

/**
 * useRecordsフックの戻り値
 */
export interface UseRecordsResult {
  /** すべての記録（新しい順） */
  records: Record[];
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 記録を再読み込み */
  refresh: () => void;
  /** 新しい記録を作成 */
  create: (input: RecordInput) => Record;
  /** 記録を更新 */
  update: (id: string, data: RecordUpdate) => Record | undefined;
  /** 記録を削除 */
  remove: (id: string) => boolean;
  /** IDで記録を取得 */
  getById: (id: string) => Record | undefined;
}

/**
 * 記録データを管理するカスタムフック
 */
export const useRecords = (): UseRecordsResult => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * LocalStorageから記録を読み込み
   */
  const loadRecords = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const data = recordStore.getAllRecords();
      setRecords(data);
    } catch (err) {
      setError('記録の読み込みに失敗しました');
      console.error('Failed to load records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 初回マウント時に読み込み
   */
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  /**
   * 記録を再読み込み
   */
  const refresh = useCallback(() => {
    loadRecords();
  }, [loadRecords]);

  /**
   * 新しい記録を作成
   */
  const create = useCallback((input: RecordInput): Record => {
    const newRecord = recordStore.createRecord(input);
    setRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  }, []);

  /**
   * 記録を更新
   */
  const update = useCallback(
    (id: string, data: RecordUpdate): Record | undefined => {
      const updatedRecord = recordStore.updateRecord(id, data);
      if (updatedRecord) {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? updatedRecord : r))
        );
      }
      return updatedRecord;
    },
    []
  );

  /**
   * 記録を削除
   */
  const remove = useCallback((id: string): boolean => {
    const success = recordStore.deleteRecord(id);
    if (success) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
    return success;
  }, []);

  /**
   * IDで記録を取得
   */
  const getById = useCallback(
    (id: string): Record | undefined => {
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
  record: Record | undefined;
  isLoading: boolean;
  error: string | null;
} => {
  const [record, setRecord] = useState<Record | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setRecord(undefined);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = recordStore.getRecordById(id);
      setRecord(data);
    } catch (err) {
      setError('記録の読み込みに失敗しました');
      console.error('Failed to load record:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { record, isLoading, error };
};
