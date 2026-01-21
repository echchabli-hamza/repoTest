import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { sessionReducer } from './store/session.reducer';

export const sessionRoutes: Routes = [
    {
        path: '',
        providers: [
            provideState('session', sessionReducer)
        ],
        loadComponent: () => import('./components/session-start.component').then(m => m.SessionStartComponent)
    }
];
