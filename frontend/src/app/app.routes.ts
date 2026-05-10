import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FlightListComponent } from './pages/flights/flight-list.component';
import { FlightDetailComponent } from './pages/flights/flight-detail.component';
import { FlightNewComponent } from './pages/flights/flight-new.component';
import { LuggageComponent } from './pages/luggage/luggage.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'flights', component: FlightListComponent },
  { path: 'flights/new', component: FlightNewComponent },
  { path: 'flights/:id', component: FlightDetailComponent },
  { path: 'luggage', component: LuggageComponent },
  { path: '**', redirectTo: '' }
];
