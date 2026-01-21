import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Dish } from '../../../core/models/dish.model';
import { AdminActions } from '../store/admin.actions';
import { MenuActions } from '../../menu/store/menu.actions';
import { selectAllDishes } from '../../menu/store/menu.selectors';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="admin-container">
      <h1>🔧 Admin Dashboard - Gestion des Plats</h1>
      
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
  `]
})
export class AdminDashboardComponent {
    dishForm: FormGroup;
    dishes$: Observable<Dish[]>;

    constructor(private fb: FormBuilder, private store: Store) {
        this.dishForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(0)]],
            category: ['', Validators.required]
        });

        this.dishes$ = this.store.select(selectAllDishes);
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
}
