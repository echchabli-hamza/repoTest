import { createActionGroup, props } from '@ngrx/store';
import { Order } from '../../../core/models/order.model';

export const OrderActions = createActionGroup({
    source: 'Order',
    events: {
        'Create Order': props<{ order: Order }>(),
        'Load Orders': props<{ orders: Order[] }>(), // For future use if we had a backend
        'Complete Order': props<{ orderId: string }>()
    }
});
