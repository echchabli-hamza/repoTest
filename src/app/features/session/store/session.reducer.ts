import { createReducer, on } from '@ngrx/store';
import { Session } from '../../../core/models/session.model';
import { SessionActions } from './session.actions';

export interface SessionState {
    currentSession: Session | null;
    isActive: boolean;
}

export const initialState: SessionState = {
    currentSession: null,
    isActive: false
};

export const sessionReducer = createReducer(
    initialState,

    on(SessionActions.startSession, (state, { tableNumber, clientName }) => ({
        ...state,
        currentSession: {
            tableNumber,
            clientName,
            startTime: new Date()
        },
        isActive: true
    })),

    on(SessionActions.endSession, () => initialState)
);
