/**
 * 記録データの型定義
 *
 * docs/design/screens.md のデータモデル仕様に準拠
 */

/**
 * 気分タイプ
 */
export type MoodType =
  | 'excited' // 高揚
  | 'calm' // 穏やか
  | 'melancholy' // 切ない
  | 'focused' // 集中
  | 'nostalgic' // 懐かし
  | 'other'; // その他

/**
 * 気分の設定情報
 */
export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  color: string; // 選択時の背景色（HEX）
}

/**
 * 気分設定一覧
 * docs/design/screens.md の気分選択の設計に準拠
 */
export const MOOD_CONFIGS: MoodConfig[] = [
  { id: 'excited', label: '高揚', emoji: '^_^', color: '#FFA726' },
  { id: 'calm', label: '穏やか', emoji: '-_-', color: '#66BB6A' },
  { id: 'melancholy', label: '切ない', emoji: ';_;', color: '#42A5F5' },
  { id: 'focused', label: '集中', emoji: 'o_o', color: '#AB47BC' },
  { id: 'nostalgic', label: '懐かし', emoji: 'v_v', color: '#8D6E63' },
  { id: 'other', label: 'その他', emoji: '...', color: '#BDBDBD' },
];

/**
 * MoodTypeからMoodConfigを取得
 */
export const getMoodConfig = (moodType: MoodType): MoodConfig => {
  const config = MOOD_CONFIGS.find((c) => c.id === moodType);
  if (!config) {
    throw new Error(`Unknown mood type: ${moodType}`);
  }
  return config;
};

/**
 * 記録データ
 */
export interface Record {
  id: string; // UUID v4
  url: string; // 共有URL
  mood: MoodType; // 気分
  situation: string; // 状況の一言
  createdAt: string; // ISO 8601形式（例: 2026-02-04T20:30:00+09:00）
  updatedAt: string; // ISO 8601形式
}

/**
 * 記録作成時の入力データ（id, createdAt, updatedAtは自動生成）
 */
export type RecordInput = Pick<Record, 'url' | 'mood' | 'situation'>;

/**
 * 記録更新時の入力データ
 */
export type RecordUpdate = Partial<Pick<Record, 'mood' | 'situation'>>;
