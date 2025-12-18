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
  { path: 'app-accueil', component: Accueil },
  { path: '', component: Accueil },
  { path: 'app-formulaire-co', component: FormulaireCo },
  { path: 'app-produit', component: Produit },
  { path: 'app-formulaire-inscription', component: FormulaireInscription },
  { path: 'app-menu', component: Menu },
  { path: 'app-forgot-password', component: ForgotPassword },
  { path: 'app-compte-user', component: CompteUser },
  { path: 'app-rgpd', component: Rgpd},
  { path: 'app-restaurant', component: RestaurantComponent }
];
