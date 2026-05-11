import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'flights', loadComponent: () => import('./pages/flights/flight-list.component').then(m => m.FlightListComponent) },
  { path: 'flights/new', loadComponent: () => import('./pages/flights/flight-new.component').then(m => m.FlightNewComponent) },
  { path: 'flights/:id', loadComponent: () => import('./pages/flights/flight-detail.component').then(m => m.FlightDetailComponent) },
  { path: 'luggage', loadComponent: () => import('./pages/luggage/luggage.component').then(m => m.LuggageComponent) },
  { path: '**', redirectTo: '' }
];
