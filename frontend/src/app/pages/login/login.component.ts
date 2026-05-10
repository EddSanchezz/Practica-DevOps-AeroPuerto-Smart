import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <span class="logo-icon">✈</span>
          <h1>FlyTrack</h1>
        </div>
        <h2>Iniciar Sesión</h2>
        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input type="text" id="username" [(ngModel)]="username" name="username" required placeholder="Ingresa tu usuario">
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required placeholder="Ingresa tu contraseña">
          </div>
          <div *ngIf="error" class="error-message">{{ error }}</div>
          <button type="submit" class="auth-btn" [disabled]="loading">
            {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
          </button>
        </form>
        <p class="auth-link">
          ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; }
    .auth-card { background: white; border-radius: 15px; padding: 2.5rem; width: 100%; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    .auth-header { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; }
    .logo-icon { font-size: 2.5rem; }
    .auth-header h1 { color: #1e3c72; font-size: 1.8rem; margin: 0; }
    h2 { text-align: center; color: #333; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500; }
    input { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
    input:focus { outline: none; border-color: #667eea; }
    .error-message { color: #e74c3c; font-size: 0.9rem; margin-bottom: 1rem; text-align: center; }
    .auth-btn { width: 100%; padding: 0.9rem; background: #1e3c72; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s; }
    .auth-btn:hover { background: #2a5298; }
    .auth-btn:disabled { background: #999; cursor: not-allowed; }
    .auth-link { text-align: center; margin-top: 1.5rem; color: #666; }
    .auth-link a { color: #667eea; text-decoration: none; font-weight: 600; }
    .auth-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.authService.setToken(response.access_token);
        this.authService.setUsername(this.username);
        this.router.navigate(['/flights']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}