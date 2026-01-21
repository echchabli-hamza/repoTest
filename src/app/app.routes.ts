import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
        canActivate: [authGuard],
        loadChildren: () => import('./features/menu/menu.routes').then(m => m.menuRoutes)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
    }
];
