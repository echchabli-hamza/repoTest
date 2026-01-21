import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    }
];
