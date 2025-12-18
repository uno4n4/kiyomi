import { Routes } from '@angular/router';
import { Accueil } from './components/accueil/accueil';
import { FormulaireCo } from './components/formulaire-co/formulaire-co';
import { Produit } from './components/produit/produit';
import { FormulaireInscription } from './components/formulaire-inscription/formulaire-inscription';
import { Menu } from './components/menu/menu';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { CompteUser } from './components/compte-user/compte-user';
import { Rgpd } from './components/rgpd/rgpd';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import path from 'path';

export const routes: Routes = [
  { path: 'app-accueil', component: Accueil, data: { accueil: true }},
  { path: '', component: Accueil, data: { accueil: true }},
  { path: 'app-formulaire-co', component: FormulaireCo, data: { accueil: false } },
  { path: 'app-produit', component: Produit, data: { accueil: false } },
  { path: 'app-formulaire-inscription', component: FormulaireInscription, data: { accueil: false } },
  { path: 'app-menu', component: Menu, data: { accueil: false } },
  { path: 'app-forgot-password', component: ForgotPassword, data: { accueil: false } },
  { path: 'app-compte-user', component: CompteUser, data: { accueil: false } },
  { path: 'app-rgpd', component: Rgpd, data: { accueil: false }},
  { path: 'app-restaurant', component: RestaurantComponent, data: { accueil: false } }
];
