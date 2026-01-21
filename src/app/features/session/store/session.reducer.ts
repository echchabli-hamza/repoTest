import { createReducer, on } from '@ngrx/store';
import { SessionActions } from './session.actions';

export interface SessionState {
    tableNumber: number | null;
    clientName: string | null;
    isActive: boolean;
    startedAt: Date | null;
}

export const initialState: SessionState = {
    tableNumber: null,
    clientName: null,
    isActive: false,
    startedAt: null
};

export const sessionReducer = createReducer(
    initialState,
    on(SessionActions.startSession, (state, { tableNumber, clientName }) => ({
        ...state,
        tableNumber,
        clientName,
        isActive: true,
        startedAt: new Date()
    })),
    on(SessionActions.endSession, (state) => ({
        ...state,
        isActive: false,
        startedAt: null
    }))
);
