/**
 * 日付ユーティリティ
 *
 * docs/design/screens.md の時間帯定義に準拠
 */

/**
 * 時間帯の定義
 * docs/design/screens.md より:
 * - 朝: 05:00 - 11:59
 * - 昼: 12:00 - 16:59
 * - 夕: 17:00 - 19:59
 * - 夜: 20:00 - 04:59
 */
export type TimeOfDay = '朝' | '昼' | '夕' | '夜';

/**
 * 時刻から時間帯を判定
 * @param date Date オブジェクト
 * @returns 時間帯
 */
export const getTimeOfDay = (date: Date): TimeOfDay => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return '朝';
  } else if (hour >= 12 && hour < 17) {
    return '昼';
  } else if (hour >= 17 && hour < 20) {
    return '夕';
  } else {
    // 20:00 - 04:59
    return '夜';
  }
};

/**
 * 曜日の配列
 */
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 日付を「YYYY年M月D日（曜日）時間帯」形式でフォーマット
 * @param isoString ISO 8601形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export const formatDateWithTimeOfDay = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  const timeOfDay = getTimeOfDay(date);

  return `${year}年${month}月${day}日（${weekday}）${timeOfDay}`;
};

/**
 * 日付を「YYYY年M月D日（曜日）」形式でフォーマット（時間帯なし）
 * @param isoString ISO 8601形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  return `${year}年${month}月${day}日（${weekday}）`;
};

/**
 * 2つの日付が同じ日付セクション（日付+時間帯）かどうかを判定
 * @param isoString1 ISO 8601形式の日付文字列
 * @param isoString2 ISO 8601形式の日付文字列
 * @returns 同じセクションならtrue
 */
export const isSameDateSection = (
  isoString1: string,
  isoString2: string
): boolean => {
  return formatDateWithTimeOfDay(isoString1) === formatDateWithTimeOfDay(isoString2);
};

/**
 * UUID v4を生成
 * @returns UUID v4形式の文字列
 */
export const generateUUID = (): string => {
  // crypto.randomUUID()が使える環境ではそれを使う
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // フォールバック実装
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 現在時刻をISO 8601形式で取得
 * @returns ISO 8601形式の日付文字列
 */
export const getCurrentISOString = (): string => {
  return new Date().toISOString();
};
