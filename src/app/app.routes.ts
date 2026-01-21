import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/session',
        pathMatch: 'full'
    },
    {
        path: 'session',
        loadChildren: () => import('./features/session/session.routes').then(m => m.sessionRoutes)
    },
    {
        path: 'menu',
        loadChildren: () => import('./features/menu/menu.routes').then(m => m.menuRoutes)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
    }
];
