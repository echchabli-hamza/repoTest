import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionActions } from '../store/session.actions';

@Component({
    selector: 'app-session-start',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="session-start">
      <h1>🍽️  Bienvenue au Restaurant</h1>
      <p>Entrez vos informations pour accéder au menu instantanément</p>
      
      <form [formGroup]="sessionForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="tableNumber">Numéro de Table</label>
          <input 
            id="tableNumber" 
            type="number" 
            formControlName="tableNumber"
            placeholder="Ex: 5">
        </div>
        
        <div class="form-group">
          <label for="clientName">Votre Nom</label>
          <input 
            id="clientName" 
            type="text" 
            formControlName="clientName"
            placeholder="Ex: Jean Dupont">
        </div>
        
        <button type="submit" [disabled]="sessionForm.invalid" class="submit-btn">
          Accéder au Menu
        </button>
      </form>
    </div>
  `,
    styles: [`
    .session-start {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    h1 { text-align: center; color: #2e7d32; }
    p { text-align: center; color: #666; margin-bottom: 30px; }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
    }
    
    .submit-btn {
      width: 100%;
      padding: 14px;
      background: #2e7d32;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    }
    
    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .submit-btn:hover:not(:disabled) {
      background: #1b5e20;
    }
  `]
})
export class SessionStartComponent {
    sessionForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router
    ) {
        this.sessionForm = this.fb.group({
            tableNumber: ['', [Validators.required, Validators.min(1)]],
            clientName: ['', [Validators.required, Validators.minLength(2)]]
        });
    }

    onSubmit(): void {
        if (this.sessionForm.valid) {
            const { tableNumber, clientName } = this.sessionForm.value;

            // Dispatch action NgRx pour démarrer la session
            this.store.dispatch(SessionActions.startSession({
                tableNumber: Number(tableNumber),
                clientName
            }));

            // Redirection vers le menu
            this.router.navigate(['/menu']);
        }
    }
}
