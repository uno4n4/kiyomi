import { Routes } from '@angular/router';
import { Accueil} from './components/accueil/accueil';

export const routes: Routes = [
    {path:'', component: Accueil},
    {path:'**', component: Accueil},
    {path:'app-accueil', component: Accueil}
];
//le premier path est la route par defaut: ''. Affichage de base
//le deuxieme path est la route wildcard: '**'. Utile si la route n'existe pas
