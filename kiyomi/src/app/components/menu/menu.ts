//à ajouter : window.location.reload(); pour régler le pb d'affichage
import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ListeBoxes } from '../../services/liste-boxes'; //import du service de recuperation des boxes
import { AjoutPanier } from '../../services/ajout-panier'; //import du service d'ajout de boxes dans le panier
import { OnInit } from '@angular/core';
import { isEmpty } from 'rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SearchBarFilters } from '../search-bar-filters/search-bar-filters';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, SearchBarFilters],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  apiListe: any[] = []; //variable pour stocker les données de l'API
  apiPanier: any;
  user: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private listeBoxes: ListeBoxes,
    private AjoutPanier: AjoutPanier,
    private router: Router
  ) {} //injection du parametre pour la connexion - des services - du router pour les redirections

  ngOnInit(): void {
    // charger l'API pour éviter que totalBoxPositive reste à 0 au reload
    this.listeBoxes.getBoxes().subscribe((menus) => {
      console.log('Données reçues:', menus);
      this.apiListe = menus;
    });
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  }

  //REDIRECTION VERS LA "PAGE MENU"
  renvoiMenu() {
    this.router.navigate(['/app-menu']); //renvoie au component menu
  }

  //REDIRECTION VERS LA "PAGE" PRODUIT - LAURA A MODIFIER
  pageProduit(boxe_id:number) {
    this.router.navigate(['/app-produit'], {
      queryParams: { id: boxe_id },
    });
  }

  //AFFICHAGE PAR 6 DES DIFFERENTES BOXES
  visibleBoxes = 6;

  get boxesToShow() {
    return this.apiListe.slice(0, this.visibleBoxes);
  }

  get totalBoxPositive() {
    return this.visibleBoxes < this.apiListe.length;
  }

  voirPlus() {
    this.visibleBoxes += 6;
  }

  // AJOUT PANIER EN FONCTION DE LA CONNECTION USER
  addPanier(idPanier: number): any {
    if (!this.user) {
      this.router.navigate(['/app-formulaire-co']); //renvoie au component app-formulaire-co
    } else {
      //sinon on ajoute la boxe au panier de l'user
      let user_id: number = this.user['id'];
      const quantity = 1; // par défaut

      const items = [{ idPanier, quantity }]; //comme on ajoute dans le panier 1par1 au clic du bouton commander
      return this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe(
        (panier) => {
          this.apiPanier = panier; //stockage des données reçues dans la variable
        }
      );
    }
  }
}
