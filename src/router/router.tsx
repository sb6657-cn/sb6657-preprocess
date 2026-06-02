import { createBrowserRouter } from 'react-router';
import Home from '@/pages/Home/Home';
import WarriorsDonk from '@/pages/15warriorsDonk/15warriorsDonk';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/15warriorsDonk',
        element: <WarriorsDonk />,
    },
]);
