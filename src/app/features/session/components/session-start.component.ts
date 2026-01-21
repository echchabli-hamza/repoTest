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
      
      <!-- CLIENT MODE -->
      <div *ngIf="!showAdminLogin">
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

        <div class="admin-link-container">
          <button class="text-btn" (click)="toggleAdminMode()">Accès Admin</button>
        </div>
      </div>

      <!-- ADMIN MODE -->
      <div *ngIf="showAdminLogin">
        <p>Connexion Administrateur</p>
        
        <form [formGroup]="adminForm" (ngSubmit)="onAdminSubmit()">
          <div class="form-group">
            <label for="username">Identifiant</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username"
              placeholder="admin">
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              placeholder="••••••">
          </div>
          
          <div *ngIf="loginError" class="error-msg">Identifiants incorrects</div>

          <button type="submit" [disabled]="adminForm.invalid" class="submit-btn admin-btn">
            Se Connecter
          </button>
        </form>

        <div class="admin-link-container">
          <button class="text-btn" (click)="toggleAdminMode()">Retour Client</button>
        </div>
      </div>
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

    .admin-btn {
      background: #1976d2;
    }
    .admin-btn:hover:not(:disabled) {
      background: #1565c0;
    }

    .admin-link-container {
      margin-top: 20px;
      text-align: center;
    }

    .text-btn {
      background: none;
      border: none;
      color: #666;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: underline;
    }
    
    .text-btn:hover {
      color: #333;
    }

    .error-msg {
      color: #d32f2f;
      margin-bottom: 10px;
      text-align: center;
      font-size: 0.9rem;
    }
  `]
})
export class SessionStartComponent {
  sessionForm: FormGroup;
  adminForm: FormGroup;
  showAdminLogin = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      tableNumber: ['', [Validators.required, Validators.min(1)]],
      clientName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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

  toggleAdminMode(): void {
    this.showAdminLogin = !this.showAdminLogin;
    this.loginError = false;
    if (this.showAdminLogin) {
      this.adminForm.reset();
    } else {
      this.sessionForm.reset();
    }
  }

  onAdminSubmit(): void {
    if (this.adminForm.valid) {
      const { username, password } = this.adminForm.value;
      // Hardcoded credentials as requested
      if (username === 'admin' && password === 'admin') {
        this.store.dispatch(SessionActions.adminLogin());
        this.router.navigate(['/admin']);
      } else {
        this.loginError = true;
        this.adminForm.patchValue({ password: '' });
      }
    }
  }
}
