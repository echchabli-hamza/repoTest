import { createReducer, on } from '@ngrx/store';
import { Order } from '../../../core/models/order.model';
import { OrderActions } from './order.actions';

export interface OrderState {
    orders: Order[];
}

export const initialState: OrderState = {
    orders: []
};

export const orderReducer = createReducer(
    initialState,
    on(OrderActions.createOrder, (state, { order }) => ({
        ...state,
        orders: [order, ...state.orders]
    })),
    on(OrderActions.completeOrder, (state, { orderId }) => ({
        ...state,
        orders: state.orders.map(o =>
            o.id === orderId ? { ...o, status: 'COMPLETED' } : o
        )
    }))
);
