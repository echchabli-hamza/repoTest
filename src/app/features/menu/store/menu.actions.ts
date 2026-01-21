import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Dish } from '../../../core/models/dish.model';

export const MenuActions = createActionGroup({
    source: 'Menu',
    events: {
        'Load Dishes': emptyProps(),
        'Load Dishes Success': props<{ dishes: Dish[] }>(),
        'Load Dishes Failure': props<{ error: string }>(),

        'Load Dish By Id': props<{ id: string }>(),
        'Load Dish By Id Success': props<{ dish: Dish }>(),
        'Load Dish By Id Failure': props<{ error: string }>(),

        'Filter By Category': props<{ category: string }>(),
    }
});
