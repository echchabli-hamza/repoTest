import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Dish } from '../../../core/models/dish.model';
import { CartItem } from '../../../core/models/cart-item.model';

export const CartActions = createActionGroup({
    source: 'Cart',
    events: {
        'Add Item': props<{ dish: Dish; quantity?: number; notes?: string }>(),
        'Remove Item': props<{ dishId: string }>(),
        'Update Quantity': props<{ dishId: string; quantity: number }>(),
        'Update Notes': props<{ dishId: string; notes: string }>(),
        'Clear Cart': emptyProps(),
        'Load Cart': emptyProps(),
        'Save Cart': props<{ items: CartItem[] }>()
    }
});
