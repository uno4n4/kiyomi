//à ajouter : window.location.reload(); pour régler le pb d'affichage
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoxesEnsemble } from "../boxes-ensemble/boxes-ensemble";

@Component({
  selector: 'app-menu',
  imports: [CommonModule, BoxesEnsemble],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {} //injection du parametre pour la connexion - des services - du router pour les redirections

}
