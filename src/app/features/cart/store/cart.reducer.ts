import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../../core/models/cart-item.model';
import { CartActions } from './cart.actions';

export interface CartState {
    items: CartItem[];
    total: number;
}

export const initialState: CartState = {
    items: [],
    total: 0
};

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
};

export const cartReducer = createReducer(
    initialState,

    on(CartActions.addItem, (state, { dish, quantity = 1, notes }) => {
        const existingItemIndex = state.items.findIndex(item => item.dish.id === dish.id);
        let newItems: CartItem[];

        if (existingItemIndex > -1) {
            newItems = state.items.map((item, index) =>
                index === existingItemIndex
                    ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                    : item
            );
        } else {
            newItems = [...state.items, { dish, quantity, notes }];
        }

        return {
            ...state,
            items: newItems,
            total: calculateTotal(newItems)
        };
    }),

    on(CartActions.removeItem, (state, { dishId }) => {
        const newItems = state.items.filter(item => item.dish.id !== dishId);
        return {
            ...state,
            items: newItems,
            total: calculateTotal(newItems)
        };
    }),

    on(CartActions.updateQuantity, (state, { dishId, quantity }) => {
        if (quantity <= 0) {
            const newItems = state.items.filter(item => item.dish.id !== dishId);
            return {
                ...state,
                items: newItems,
                total: calculateTotal(newItems)
            };
        }

        const newItems = state.items.map(item =>
            item.dish.id === dishId ? { ...item, quantity } : item
        );

        return {
            ...state,
            items: newItems,
            total: calculateTotal(newItems)
        };
    }),

    on(CartActions.updateNotes, (state, { dishId, notes }) => {
        const newItems = state.items.map(item =>
            item.dish.id === dishId ? { ...item, notes } : item
        );

        return {
            ...state,
            items: newItems
        };
    }),

    on(CartActions.clearCart, () => initialState),

    on(CartActions.loadCart, (state) => state),

    on(CartActions.saveCart, (state, { items }) => ({
        ...state,
        items,
        total: calculateTotal(items)
    }))
);
