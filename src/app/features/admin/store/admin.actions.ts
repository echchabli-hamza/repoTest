import { createActionGroup, props } from '@ngrx/store';
import { Dish } from '../../../core/models/dish.model';

export const AdminActions = createActionGroup({
    source: 'Admin',
    events: {
        'Add Dish': props<{ dish: Omit<Dish, 'id'> }>(),
        'Update Dish': props<{ id: string; dish: Partial<Dish> }>(),
        'Delete Dish': props<{ id: string }>(),
        'Toggle Availability': props<{ id: string }>()
    }
});
