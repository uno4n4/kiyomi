import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ListeBoxes } from '../../services/liste-boxes'; //import du service de recuperation des boxes
import { AjoutPanier } from '../../services/ajout-panier'; //import du service d'ajout de boxes dans le panier
import { OnInit } from '@angular/core';
import { Footer } from '../footer/footer';
import { isEmpty } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, Footer],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
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
    this.getDataFromAPI(); //appel de la methode au chargement du composant
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  }

  getDataFromAPI() {
    return this.listeBoxes.getBoxes().subscribe((menus) => {
      this.apiListe = menus; //stockage des données reçues dans la variable
    });
  }

  addPanier(idPanier: number):any {
    if (!this.user) {
      this.router.navigate(['/app-formulaire-co']);//renvoie au component app-formulaire-co
    } else {
      //sinon on ajoute la boxe au panier de l'user
      let user_id: number = this.user["id"];
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
