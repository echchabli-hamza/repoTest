import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MenuState } from './menu.reducer';

export const selectMenuState = createFeatureSelector<MenuState>('menu');

export const selectAllDishes = createSelector(
    selectMenuState,
    (state) => state.dishes
);

export const selectSelectedDish = createSelector(
    selectMenuState,
    (state) => state.selectedDish
);

export const selectMenuLoading = createSelector(
    selectMenuState,
    (state) => state.loading
);

export const selectMenuError = createSelector(
    selectMenuState,
    (state) => state.error
);

export const selectSelectedCategory = createSelector(
    selectMenuState,
    (state) => state.selectedCategory
);

export const selectFilteredDishes = createSelector(
    selectAllDishes,
    selectSelectedCategory,
    (dishes, category) => {
        if (!category) {
            return dishes;
        }
        return dishes.filter(dish => dish.category === category);
    }
);

export const selectAvailableDishes = createSelector(
    selectFilteredDishes,
    (dishes) => dishes.filter(dish => dish.available)
);
