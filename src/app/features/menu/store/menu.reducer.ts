import { createReducer, on } from '@ngrx/store';
import { Dish } from '../../../core/models/dish.model';
import { MenuActions } from './menu.actions';

export interface MenuState {
    dishes: Dish[];
    selectedDish: Dish | null;
    loading: boolean;
    error: string | null;
    selectedCategory: string | null;
}

// Initial dishes stored in NgRx
export const initialState: MenuState = {
    dishes: [
        { id: '1', name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic', price: 12.50, category: 'Plats', available: true },
        { id: '2', name: 'Burger Classic', description: 'Bœuf, salade, tomate, oignons', price: 10.00, category: 'Plats', available: true },
        { id: '3', name: 'Salade César', description: 'Laitue romaine, poulet, parmesan', price: 9.50, category: 'Entrées', available: true },
        { id: '4', name: 'Tiramisu', description: 'Mascarpone, café, cacao', price: 6.50, category: 'Desserts', available: true },
        { id: '5', name: 'Pâtes Carbonara', description: 'Lardons, crème, parmesan', price: 11.00, category: 'Plats', available: true },
        { id: '6', name: 'Tarte au Citron', description: 'Pâte sablée, crème citron, meringue', price: 5.50, category: 'Desserts', available: true }
    ],
    selectedDish: null,
    loading: false,
    error: null,
    selectedCategory: null
};

export const menuReducer = createReducer(
    initialState,

    on(MenuActions.loadDishes, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(MenuActions.loadDishesSuccess, (state, { dishes }) => ({
        ...state,
        dishes,
        loading: false,
        error: null
    })),

    on(MenuActions.loadDishesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(MenuActions.loadDishById, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(MenuActions.loadDishByIdSuccess, (state, { dish }) => ({
        ...state,
        selectedDish: dish,
        loading: false,
        error: null
    })),

    on(MenuActions.loadDishByIdFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(MenuActions.filterByCategory, (state, { category }) => ({
        ...state,
        selectedCategory: category
    }))
);
