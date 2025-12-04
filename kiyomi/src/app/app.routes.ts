import { Routes } from '@angular/router';
import { Accueil} from './components/accueil/accueil';
import { FormulaireCo } from './components/formulaire-co/formulaire-co';
import { Produit } from './components/produit/produit';

export const routes: Routes = [
    {path:'', component: Accueil},
    {path:'app-accueil', component: Accueil},
    {path:'app-formulaire-co', component: FormulaireCo},
    {path:'app-produit', component: Produit}
];
//le premier path est la route par defaut: ''. Affichage de base
//le deuxieme path est la route wildcard: '**'. Utile si la route n'existe pas
