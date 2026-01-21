import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionState } from './session.reducer';

export const selectSessionState = createFeatureSelector<SessionState>('session');

export const selectIsActive = createSelector(
    selectSessionState,
    (state) => state.isActive
);

export const selectClientName = createSelector(
    selectSessionState,
    (state) => state.clientName
);

export const selectTableNumber = createSelector(
    selectSessionState,
    (state) => state.tableNumber
);

export const selectUserType = createSelector(
    selectSessionState,
    (state) => state.userType
);

export const selectIsAdmin = createSelector(
    selectUserType,
    (type) => type === 'ADMIN'
);

export const selectIsClient = createSelector(
    selectUserType,
    (type) => type === 'CLIENT'
);
