import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.reducer';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

export const selectAllOrders = createSelector(
    selectOrderState,
    (state) => state.orders
);

export const selectPendingOrders = createSelector(
    selectAllOrders,
    (orders) => orders.filter(o => o.status === 'PENDING')
);
