/**
 * 記録データのLocalStorageストア
 *
 * docs/design/screens.md のLocalStorageキー仕様に準拠:
 * hearloom_records: Record[] - 全記録の配列をJSON文字列で保存
 */

import type { Record, RecordInput, RecordUpdate } from '../types/record';
import { generateUUID, getCurrentISOString } from '../utils/dateUtils';

const STORAGE_KEY = 'hearloom_records';

/**
 * LocalStorageからすべての記録を取得
 * @returns Record配列（新しい順にソート済み）
 */
export const getAllRecords = (): Record[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const records: Record[] = JSON.parse(data);
    // 作成日時の降順でソート（新しい順）
    return records.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Failed to get records from localStorage:', error);
    return [];
  }
};

/**
 * IDで記録を取得
 * @param id 記録ID
 * @returns Record または undefined
 */
export const getRecordById = (id: string): Record | undefined => {
  const records = getAllRecords();
  return records.find((r) => r.id === id);
};

/**
 * 新しい記録を作成
 * @param input 記録入力データ
 * @returns 作成されたRecord
 */
export const createRecord = (input: RecordInput): Record => {
  const now = getCurrentISOString();
  const newRecord: Record = {
    id: generateUUID(),
    url: input.url,
    mood: input.mood,
    situation: input.situation,
    createdAt: now,
    updatedAt: now,
  };

  const records = getAllRecords();
  records.push(newRecord);
  saveRecords(records);

  return newRecord;
};

/**
 * 記録を更新
 * @param id 記録ID
 * @param update 更新データ
 * @returns 更新されたRecord または undefined（見つからない場合）
 */
export const updateRecord = (
  id: string,
  update: RecordUpdate
): Record | undefined => {
  const records = getAllRecords();
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedRecord: Record = {
    ...records[index],
    ...update,
    updatedAt: getCurrentISOString(),
  };

  records[index] = updatedRecord;
  saveRecords(records);

  return updatedRecord;
};

/**
 * 記録を削除
 * @param id 記録ID
 * @returns 削除が成功したかどうか
 */
export const deleteRecord = (id: string): boolean => {
  const records = getAllRecords();
  const filteredRecords = records.filter((r) => r.id !== id);

  if (filteredRecords.length === records.length) {
    // 削除対象が見つからなかった
    return false;
  }

  saveRecords(filteredRecords);
  return true;
};

/**
 * 記録配列をLocalStorageに保存（内部関数）
 */
const saveRecords = (records: Record[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save records to localStorage:', error);
    throw error;
  }
};

/**
 * すべての記録を削除（デバッグ用）
 */
export const clearAllRecords = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
