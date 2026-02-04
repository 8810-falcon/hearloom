import React from 'react';
import ReactDOM from 'react-dom/client';
import { SerendieProvider } from '@serendie/ui';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SerendieProvider lang="ja">
      <App />
    </SerendieProvider>
  </React.StrictMode>
);
