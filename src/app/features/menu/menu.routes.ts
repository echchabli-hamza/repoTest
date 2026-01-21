import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { menuReducer } from './store/menu.reducer';

export const menuRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState('menu', menuReducer)
        ],
        loadComponent: () => import('./components/menu-list.component').then(m => m.MenuListComponent)
    }
];
