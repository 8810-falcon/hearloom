/**
 * メインアプリケーションコンポーネント
 *
 * React Router を使用して画面遷移を管理します。
 * PageTransition で各画面をラップし、遷移アニメーションを適用。
 *
 * ルーティング:
 * - / : 一覧画面（ホーム）
 * - /record : 記録画面（新規登録）
 * - /edit/:id : 編集画面
 *
 * トランジション:
 * - 進む時（一覧→編集）: フェードイン + 右からスライド
 * - 戻る時（編集→一覧）: フェードイン + 左からスライド
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ListScreen, RecordScreen, EditScreen } from './screens';
import { PageTransition } from './components/common';
import './App.css';

/**
 * ルーティングコンテンツ
 * useLocation を使用するため、BrowserRouter 内部に配置
 */
function AppRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        {/* 一覧画面（ホーム） */}
        <Route path="/" element={<ListScreen />} />

        {/* 記録画面（新規登録） */}
        <Route path="/record" element={<RecordScreen />} />

        {/* 編集画面 */}
        <Route path="/edit/:id" element={<EditScreen />} />

        {/* 未定義のパスは一覧画面にリダイレクト */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
