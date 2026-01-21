import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionState } from './session.reducer';

export const selectSessionState = createFeatureSelector<SessionState>('session');

export const selectCurrentSession = createSelector(
    selectSessionState,
    (state) => state.currentSession
);

export const selectIsSessionActive = createSelector(
    selectSessionState,
    (state) => state.isActive
);

export const selectTableNumber = createSelector(
    selectCurrentSession,
    (session) => session?.tableNumber
);

export const selectClientName = createSelector(
    selectCurrentSession,
    (session) => session?.clientName
);
