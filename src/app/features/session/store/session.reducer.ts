import { createReducer, on } from '@ngrx/store';
import { SessionActions } from './session.actions';

export type UserType = 'GUEST' | 'CLIENT' | 'ADMIN';

export interface SessionState {
    tableNumber: number | null;
    clientName: string | null;
    isActive: boolean;
    startedAt: Date | null;
    userType: UserType;
}

export const initialState: SessionState = {
    tableNumber: null,
    clientName: null,
    isActive: false,
    startedAt: null,
    userType: 'GUEST'
};

export const sessionReducer = createReducer(
    initialState,
    on(SessionActions.startSession, (state, { tableNumber, clientName }) => ({
        ...state,
        tableNumber,
        clientName,
        isActive: true,
        startedAt: new Date(),
        userType: 'CLIENT'
    })),
    on(SessionActions.adminLogin, (state) => ({
        ...state,
        isActive: true,
        startedAt: new Date(),
        userType: 'ADMIN',
        tableNumber: null,
        clientName: 'Administrateur'
    })),
    on(SessionActions.endSession, (state) => ({
        ...state,
        isActive: false,
        startedAt: null,
        userType: 'GUEST',
        tableNumber: null,
        clientName: null
    }))
);
