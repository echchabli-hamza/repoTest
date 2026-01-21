import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const SessionActions = createActionGroup({
    source: 'Session',
    events: {
        'Start Session': props<{ tableNumber: number; clientName: string }>(),
        'End Session': props<{ reason?: string }>(),
        'Admin Login': emptyProps()
    }
});
