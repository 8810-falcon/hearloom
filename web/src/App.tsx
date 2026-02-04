/**
 * メインアプリケーションコンポーネント
 *
 * React Router を使用して画面遷移を管理します。
 *
 * ルーティング:
 * - / : 一覧画面（ホーム）
 * - /record : 記録画面（新規登録）
 * - /edit/:id : 編集画面
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ListScreen, RecordScreen, EditScreen } from './screens';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 一覧画面（ホーム） */}
        <Route path="/" element={<ListScreen />} />

        {/* 記録画面（新規登録） */}
        <Route path="/record" element={<RecordScreen />} />

        {/* 編集画面 */}
        <Route path="/edit/:id" element={<EditScreen />} />

        {/* 未定義のパスは一覧画面にリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
