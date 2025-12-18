import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxesEnsemble } from '../boxes-ensemble/boxes-ensemble';
import { Popup } from '../popup/popup';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, BoxesEnsemble, Popup],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil{
  constructor(
  ) {} //injection du parametre pour la connexion - des services - du router pour les redirections

}
