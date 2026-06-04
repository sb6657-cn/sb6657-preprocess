import Warriors15Donk from '@/pages/15WarriorsDonk/15WarriorsDonk';
import ApiCatalog from '@/pages/ApiCatalog/ApiCatalog';
import Home from '@/pages/Home/Home';
import { createBrowserRouter } from 'react-router';

// 应对github page之类的重定向
const redirect = sessionStorage.getItem('spa_redirect');
if (redirect) {
    sessionStorage.removeItem('spa_redirect');
    const base = import.meta.env.BASE_URL;
    window.history.replaceState(null, '', `${base}${redirect}`);
}

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/15warriorsDonk',
            element: <Warriors15Donk />,
        },
        {
            path: '/apiCatalog',
            element: <ApiCatalog />,
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    }
);
