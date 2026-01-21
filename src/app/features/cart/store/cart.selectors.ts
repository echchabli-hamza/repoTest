import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
    selectCartState,
    (state) => state.items
);

export const selectCartTotal = createSelector(
    selectCartState,
    (state) => state.total
);

export const selectCartItemCount = createSelector(
    selectCartItems,
    (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartIsEmpty = createSelector(
    selectCartItems,
    (items) => items.length === 0
);

export const selectCartItemByDishId = (dishId: string) => createSelector(
    selectCartItems,
    (items) => items.find(item => item.dish.id === dishId)
);
