import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectUserType } from '../../features/session/store/session.selectors';

export const authGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectUserType).pipe(
        take(1),
        map(userType => {
            // Determine required role based on route
            const url = state.url;

            if (url.includes('admin')) {
                if (userType === 'ADMIN') return true;
                // Redirect to session entry if not admin
                return router.createUrlTree(['/session']);
            }

            if (url.includes('menu')) {
                if (userType === 'CLIENT') return true;
                // Redirect to session entry if not client
                return router.createUrlTree(['/session']);
            }

            // Default allow (should cover session entry)
            return true;
        })
    );
};
