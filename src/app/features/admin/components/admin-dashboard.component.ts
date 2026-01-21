import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Dish } from '../../../core/models/dish.model';
import { AdminActions } from '../store/admin.actions';
import { SessionActions } from '../../session/store/session.actions';
import { MenuActions } from '../../menu/store/menu.actions';
import { selectAllDishes } from '../../menu/store/menu.selectors';
import { selectAllOrders } from '../../orders/store/order.selectors';
import { Order } from '../../../core/models/order.model';
import { OrderActions } from '../../orders/store/order.actions';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>🔧 Admin Dashboard</h1>
        <button (click)="logout()" class="logout-btn">Se Déconnecter</button>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'dishes'" (click)="activeTab = 'dishes'">🍽️ Gestion Plats</button>
        <button [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">📋 Commandes ({{ (orders$ | async)?.length }})</button>
      </div>

      <!-- DISHES MANAGEMENT TAB -->
      <div *ngIf="activeTab === 'dishes'">
        <!-- ADD DISH FORM -->
        <div class="add-section">
        <h2>Ajouter un Plat</h2>
        <form [formGroup]="dishForm" (ngSubmit)="onAddDish()">
          <div class="form-row">
            <input type="text" formControlName="name" placeholder="Nom du plat">
            <input type="text" formControlName="category" placeholder="Catégorie">
            <input type="number" formControlName="price" placeholder="Prix (€)" step="0.1">
          </div>
          <textarea formControlName="description" placeholder="Description" rows="2"></textarea>
          <button type="submit" [disabled]="dishForm.invalid">➕ Ajouter</button>
        </form>
      </div>
      
      <!-- DISHES LIST -->
      <div class="dishes-section">
        <h2>Liste des Plats ({{ (dishes$ | async)?.length }})</h2>
        
        <table class="dishes-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Description</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let dish of dishes$ | async">
              <td><strong>{{ dish.name }}</strong></td>
              <td>{{ dish.category }}</td>
              <td>{{ dish.price }}€</td>
              <td>{{ dish.description }}</td>
              <td>
                <span [class]="dish.available ? 'status-active' : 'status-inactive'">
                  {{ dish.available ? '✅ Disponible' : '❌ Indisponible' }}
                </span>
              </td>
              <td class="actions">
                <button (click)="toggleAvailability(dish.id)" class="btn-toggle">
                  {{ dish.available ? 'Désactiver' : 'Activer' }}
                </button>
                <button (click)="deleteDish(dish.id)" class="btn-delete">🗑️ Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div> <!-- END DISHES TAB -->

      <!-- ORDERS TAB -->
      <div *ngIf="activeTab === 'orders'" class="orders-section">
        <h2>Commandes Clients</h2>
        
        <div class="orders-grid">
          <div *ngFor="let order of orders$ | async" class="order-card" [class.completed]="order.status === 'COMPLETED'">
            <div class="order-header">
              <span class="table-badge">Table {{ order.tableNumber }}</span>
              <span class="client-name">{{ order.clientName }}</span>
              <span class="order-time">{{ order.createdAt | date:'shortTime' }}</span>
            </div>
            
            <div class="order-items">
              <div *ngFor="let item of order.items" class="order-item">
                <span>{{ item.quantity }}x {{ item.name }}</span>
                <span>{{ item.price * item.quantity }}€</span>
              </div>
            </div>
            
            <div class="order-footer">
              <span class="total-price">Total: {{ order.totalPrice }}€</span>
              <button 
                *ngIf="order.status === 'PENDING'" 
                (click)="completeOrder(order.id)" 
                class="complete-btn">
                ✅ Terminer
              </button>
              <span *ngIf="order.status === 'COMPLETED'" class="status-completed">Terminée</span>
            </div>
          </div>
          
          <div *ngIf="(orders$ | async)?.length === 0" class="no-orders">
            Aucune commande pour le moment
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    
    .add-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .add-section h2 {
      margin-top: 0;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    input, textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    textarea {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    button[type="submit"] {
      background: #2e7d32;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      font-size: 1rem;
    }
    
    button[type="submit"]:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .dishes-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .dishes-section h2 {
      margin-top: 0;
    }
    
    .dishes-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .dishes-table th {
      background: #f5f5f5;
      padding: 1rem;
      text-align: left;
      border-bottom: 2px solid #ddd;
    }
    
    .dishes-table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .status-active {
      color: #2e7d32;
      font-weight: 500;
    }
    
    .status-inactive {
      color: #d32f2f;
      font-weight: 500;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-toggle {
      background: #1976d2;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .btn-toggle:hover {
      background: #1565c0;
    }
    
    .btn-delete {
      background: #d32f2f;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .btn-delete:hover {
      background: #c62828;
    }
    .btn-delete:hover {
      background: #c62828;
    }

    /* TABS */
    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #ddd;
    }

    .tabs button {
      background: none;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      cursor: pointer;
      color: #666;
      border-bottom: 3px solid transparent;
    }

    .tabs button.active {
      color: #2e7d32;
      border-bottom-color: #2e7d32;
      font-weight: bold;
    }

    /* ORDERS */
    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .order-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1.5rem;
      border-left: 5px solid #ffa000; /* Orange for pending */
    }

    .order-card.completed {
      border-left-color: #2e7d32; /* Green for completed */
      opacity: 0.8;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .table-badge {
      background: #333;
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-weight: bold;
    }

    .order-items {
      margin-bottom: 1rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: #555;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .total-price {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .complete-btn {
      background: #2e7d32;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .status-completed {
      color: #2e7d32;
      font-weight: bold;
    } 

    .no-orders {
      text-align: center;
      color: #999;
      grid-column: 1 / -1;
      padding: 3rem;
    }
  `]
})
export class AdminDashboardComponent {
  dishForm: FormGroup;
  dishes$: Observable<Dish[]>;
  orders$: Observable<Order[]>;
  activeTab: 'dishes' | 'orders' = 'dishes';

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });

    this.dishes$ = this.store.select(selectAllDishes);
    this.orders$ = this.store.select(selectAllOrders);
  }

  onAddDish(): void {
    if (this.dishForm.valid) {
      const dish = {
        ...this.dishForm.value,
        available: true
      };

      // Generate ID and dispatch to menu store
      const newDish: Dish = {
        id: Date.now().toString(),
        ...dish
      };

      this.store.dispatch(MenuActions.loadDishesSuccess({
        dishes: [...(this.getCurrentDishes()), newDish]
      }));

      this.dishForm.reset();
    }
  }

  toggleAvailability(id: string): void {
    const dishes = this.getCurrentDishes();
    const updatedDishes = dishes.map(dish =>
      dish.id === id ? { ...dish, available: !dish.available } : dish
    );

    this.store.dispatch(MenuActions.loadDishesSuccess({ dishes: updatedDishes }));
  }

  deleteDish(id: string): void {
    const dishes = this.getCurrentDishes();
    const updatedDishes = dishes.filter(dish => dish.id !== id);

    this.store.dispatch(MenuActions.loadDishesSuccess({ dishes: updatedDishes }));
  }

  private getCurrentDishes(): Dish[] {
    let dishes: Dish[] = [];
    this.dishes$.subscribe(d => dishes = d).unsubscribe();
    return dishes;
  }

  logout(): void {
    this.store.dispatch(SessionActions.endSession({ reason: 'Admin logout' }));
    this.router.navigate(['/session']);
  }

  completeOrder(orderId: string): void {
    this.store.dispatch(OrderActions.completeOrder({ orderId }));
  }
}
