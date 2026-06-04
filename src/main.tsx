import GithubCorner from '@/components/GithubCorner/GithubCorner.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GithubCorner />
        <App />
    </StrictMode>
);
