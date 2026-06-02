import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.tsx'

// 应对github page之类的重定向
const redirect = sessionStorage.getItem('spa_redirect');
if (redirect) {
  sessionStorage.removeItem('spa_redirect');
  const base = import.meta.env.BASE_URL;
  window.history.replaceState(
    null,
    '',
    `${base}${redirect}`,
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
