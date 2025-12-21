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
import { Filtres } from './components/filtres/filtres';
import { Mentionslegales } from './components/mentionslegales/mentionslegales';


export const routes: Routes = [
  { path: 'app-accueil', component: Accueil, data: { accueil: true, fondblanc: false } },
  { path: '', component: Accueil, data: { accueil: true, fondblanc: false } },
  { path: 'app-formulaire-co', component: FormulaireCo, data: { accueil: false, fondblanc: true } },
  { path: 'app-produit', component: Produit, data: { accueil: false, fondblanc: false } },
  { path: 'app-formulaire-inscription', component: FormulaireInscription, data: { accueil: false, fondblanc: true } },
  { path: 'app-menu', component: Menu, data: { accueil: false, fondblanc: false } },
  { path: 'app-forgot-password', component: ForgotPassword, data: { accueil: false, fondblanc: true } },
  { path: 'app-compte-user', component: CompteUser, data: { accueil: false, fondblanc: true } },
  { path: 'app-rgpd', component: Rgpd, data: { accueil: true, fondblanc: false } },
  { path: 'app-restaurant', component: RestaurantComponent, data: { accueil: false, fondblanc: true } },
  { path: 'app-filtres', component: Filtres, data: { accueil: false, fondblanc: false } },
  { path: 'app-mentionslegales', component: Mentionslegales, data: { accueil: true, fondblanc: false } }
];
