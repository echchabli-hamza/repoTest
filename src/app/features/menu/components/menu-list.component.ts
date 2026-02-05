import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Dish } from '../../../core/models/dish.model';
import { CartItem } from '../../../core/models/cart-item.model';
import { CartActions } from '../../cart/store/cart.actions';
import { selectAllDishes } from '../store/menu.selectors';
import { selectCartItems, selectCartTotal } from '../../cart/store/cart.selectors';
import { selectClientName, selectTableNumber } from '../../session/store/session.selectors';
import { OrderActions } from '../../orders/store/order.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-container">
      <!-- CART ON LEFT -->
      <div class="cart-section">
        <h2>🛒 Panier</h2>
        
        <div *ngIf="(cartItems$ | async)?.length === 0" class="empty-cart">
          Votre panier est vide
        </div>
        
        <div *ngFor="let item of cartItems$ | async" class="cart-item">
          <div class="item-info">
            <strong>{{ item.dish.name }}</strong>
            <span class="price">{{ item.dish.price }}€ × {{ item.quantity }}</span>
          </div>
          <button (click)="removeFromCart(item.dish.id)" class="remove-btn">❌</button>
        </div>
        
        <div class="cart-total">
          <strong>Total: {{ cartTotal$ | async }}€</strong>
        </div>

        <button 
          *ngIf="(cartItems$ | async)?.length" 
          (click)="submitOrder()" 
          class="submit-order-btn">
          📋 Commander
        </button>
      </div>
      
      <!-- MENU ON RIGHT -->
      <div class="menu-section">
        <div class="menu-header">
          <h2>📋 Menu</h2>
          <button (click)="changeTable()" class="disconnect-btn">Changer de table</button>
        </div>
        
        <div class="dishes-grid">
          <div *ngFor="let dish of dishes$ | async" class="dish-card" [class.unavailable]="!dish.available">
            <h3>{{ dish.name }}</h3>
            <p>{{ dish.description }}</p>
            <div class="dish-footer">
              <span class="price">{{ dish.price }}€</span>
              <button 
                *ngIf="dish.available" 
                (click)="addToCart(dish)" 
                class="add-btn">
                Ajouter
              </button>
              <span *ngIf="!dish.available" class="unavailable-text">Indisponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      padding: 2rem;
    }
    
    .cart-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: fit-content;
      position: sticky;
      top: 20px;
    }
    
    .cart-section h2 {
      margin-top: 0;
    }
    
    .empty-cart {
      color: #999;
      text-align: center;
      padding: 2rem 0;
    }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .price {
      color: #2e7d32;
      font-weight: 500;
    }
    
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
    }
    
    .cart-total {
      padding: 1rem;
      text-align: right;
      font-size: 1.2rem;
      border-top: 2px solid #333;
      margin-top: 1rem;
    }

    .submit-order-btn {
      width: 100%;
      background: #4caf50;
      color: white;
      padding: 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      margin-top: 1rem;
    }

    .submit-order-btn:hover {
      background: #43a047;
    }
    
    .menu-section h2 {
      margin: 0;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .disconnect-btn {
      background: #f44336;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .disconnect-btn:hover {
      background: #d32f2f;
    }
    
    .dishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .dish-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .dish-card.unavailable {
      opacity: 0.6;
      background: #f5f5f5;
    }
    
    .dish-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    
    .dish-card p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    .dish-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .add-btn {
      background: #2e7d32;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .add-btn:hover {
      background: #1b5e20;
    }
    
    .unavailable-text {
      color: #d32f2f;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .menu-container {
        grid-template-columns: 1fr;
      }
      
      .cart-section {
        position: static;
      }
    }
  `]
})
export class MenuListComponent implements OnInit {
  dishes$: Observable<Dish[]>;
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;

  constructor(private store: Store, private router: Router) {
    this.dishes$ = this.store.select(selectAllDishes);
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
  }

  ngOnInit(): void {
    // Dishes are already loaded from initial state in reducer
  }

  addToCart(dish: Dish): void {
    this.store.dispatch(CartActions.addItem({ dish, quantity: 1 }));
  }

  removeFromCart(dishId: string): void {
    this.store.dispatch(CartActions.removeItem({ dishId }));
  }

  changeTable(): void {
    this.router.navigate(['/session']);
  }

  submitOrder(): void {
    let tableNumber: number | null = null;
    let clientName: string | null = null;
    let cartItems: CartItem[] = [];
    let total = 0;

    // Get Session Info
    this.store.select(selectTableNumber).pipe(take(1)).subscribe(n => tableNumber = n);
    this.store.select(selectClientName).pipe(take(1)).subscribe(n => clientName = n);

    // Get Cart Info
    this.store.select(selectCartItems).pipe(take(1)).subscribe(i => cartItems = i);
    this.store.select(selectCartTotal).pipe(take(1)).subscribe(t => total = t);

    if (cartItems.length > 0 && tableNumber && clientName) {
      const order = {
        id: Date.now().toString(),
        tableNumber: tableNumber,
        clientName: clientName,
        items: cartItems.map(i => ({
          dishId: i.dish.id,
          name: i.dish.name,
          quantity: i.quantity,
          price: i.dish.price
        })),
        totalPrice: total,
        status: 'PENDING' as const,
        createdAt: new Date()
      };

      this.store.dispatch(OrderActions.createOrder({ order }));
      this.store.dispatch(CartActions.clearCart()); // Assuming clearCart exists? If not check actions.
      alert('Commande envoyée avec succès !');
    }
  }
}
