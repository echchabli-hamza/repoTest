import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SessionActions = createActionGroup({
    source: 'Session',
    events: {
        'Start Session': props<{ tableNumber: number; clientName: string }>(),
        'End Session': emptyProps()
    }
});
