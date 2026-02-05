import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { cartReducer } from './features/cart/store/cart.reducer';
import { menuReducer } from './features/menu/store/menu.reducer';
import { orderReducer } from './features/orders/store/order.reducer';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      cart: cartReducer,  // Global cart state
      menu: menuReducer,   // Global menu state (persists dishes)
      orders: orderReducer
    })
  ]
};
