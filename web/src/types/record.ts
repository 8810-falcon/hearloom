/**
 * 記録データの型定義
 *
 * bridge/types.ts からの再エクスポート
 * 新コンセプト（Song型ベース）に統一
 */

// Bridge APIの型定義を再エクスポート
export type {
  MoodType,
  MoodConfig,
  MusicRecord,
  MusicRecordInput,
  MusicRecordUpdate,
  MusicRecordFilter,
  Song,
} from '../bridge/types';

export { MOOD_CONFIGS, getMoodConfig } from '../bridge/types';
