import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ListeBoxes } from '../../services/liste-boxes';
import { AjoutPanier } from '../../services/ajout-panier';
import { SearchTerm } from '../../services/search-term';
import { Searching } from '../../services/searching';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { isEmpty } from 'rxjs';
import { FildAriane } from '../fild-ariane/fild-ariane';
import { Filtres } from '../filtres/filtres';
import { SearchBarFilters } from '../search-bar-filters/search-bar-filters';

@Component({
  selector: 'app-boxes-ensemble',
  standalone: true,
  imports: [CommonModule, FildAriane, Filtres, SearchBarFilters],
  templateUrl: './boxes-ensemble.html',
  styleUrl: './boxes-ensemble.css',
})
export class BoxesEnsemble implements OnInit, AfterViewInit {
  apiListe: any[] = []; //variable pour stocker les données de l'API
  apiRecherche: any[] = [];
  apiPanier: any;
  user: any = null;
  accueil: boolean = false;
  termedeRecherche: string = ''; //terme de recherche initialisé vides

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private listeBoxes: ListeBoxes,
    private AjoutPanier: AjoutPanier,
    private searchTerm: SearchTerm,
    private searching: Searching,
    private router: Router
  ) {} //injection du parametre pour la connexion - des services - du router pour les redirections

  // FILTRES
  //applyFilters(filters: any) {
  /// this.listeBoxes.getBoxes(filtres).subscribe((menus) => {
  //  this.apiListe = menus;
  //  this.visibleBoxes = 6;
  //  });
  // }

  ngOnInit(): void {
    this.getDataFromAPI(); //appel de la methode au chargement du composant

    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }

      const currentUrl = this.router.url;
      if (
        currentUrl.includes('/app-accueil') ||
        window.location.href === 'http://localhost:4200' ||
        window.location.href === 'http://localhost:4200/'
      ) {
        this.accueil = true;
      } else {
        this.accueil = false;
      }
    }

    this.getDataFromSearchAPI();
  }

  ngAfterViewInit(): void {
    //on veille à bien appliquer les styles après le chargement de la vue
    if (!isPlatformBrowser(this.platformId)) return;
    // requestAnimationFrame garantit que le DOM est prêt
    requestAnimationFrame(() => {
      this.getDataFromAPI();
      this.getDataFromSearchAPI();
    });
  }

  //REDIRECTION VERS LA "PAGE MENU"
  renvoiMenu() {
    this.router.navigate(['/app-menu']); //renvoie au component menu
  }

  //REDIRECTION VERS LA "PAGE" PRODUIT
  pageProduit(boxe_id: number) {
    this.router.navigate(['/app-produit'], {
      queryParams: { id: boxe_id },
    });
  }

  //AFFICHAGE PAR 6 DES DIFFERENTES BOXES
  visibleBoxes = 6;

  get boxesToShow() {
    const affichage = this.termedeRecherche ? this.apiRecherche : this.apiListe;
    return affichage.slice(0, this.visibleBoxes);
  }

  //window.location.reload();

  //VERIFIEE SI IL RESTE DES BOXES A AFFICHER
  get totalBoxPositive() {
    const affichage = this.termedeRecherche ? this.apiRecherche : this.apiListe;
    return affichage.length > 0 && this.visibleBoxes < affichage.length;
  }

  voirPlus() {
    this.visibleBoxes += 6;
  }

  //GESTION ERREUR IMAGE
  onImgError(event: any) {
    event.target.src = './../../assets/images/boxe_default.jpg';
  }

  // charger l'API pour éviter que totalBoxPositive reste à 0 au reload
  getDataFromAPI() {
    this.listeBoxes.getBoxes().subscribe((menus) => {
      this.apiListe = menus;
    });
  }

  getDataFromSearchAPI() {
    //abonnement aux changements du terme de recherche
    this.searchTerm.search$.subscribe((value) => {
      this.termedeRecherche = value; //mise à jour du terme de recherche avec la recuperation du service searchTerm

      // reset affichage
      this.visibleBoxes = 6;

      this.searching.rechercheEnCours(this.termedeRecherche).subscribe((results) => {
        if (results.success) {
          this.apiRecherche = results.match;
        } else {
          this.apiRecherche = [];
        }
      });
    });
  }

  // Variables pour les popups
  showErrorPopup = false;
  errorMessage = '';
  showSuccessPopup = false;
  successMessage = '';

  // fermer les popups
  closeErrorPopup() {
    this.showErrorPopup = false;
    this.errorMessage = '';
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.successMessage = '';
  }

  // AJOUT AU PANIER
  addPanier(idPanier: number): any {
    if (!this.user) {
      this.router.navigate(['/app-formulaire-co'], {
        queryParams: { idPanier: idPanier },
      });
    } else {
      const user_id: number = this.user['id'];
      const quantity = 1;
      const items: { box_id: number; quantity: number }[] = [{ box_id: idPanier, quantity }];

      this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe({
        next: (response) => {
          if (response.success) {
            this.apiPanier = response;
            this.successMessage = 'Votre commande a bien été prise en compte !';
            this.showSuccessPopup = true;
          } else {
            this.errorMessage =
              response.error ||
              'Impossible d’ajouter la box au panier. La limite de stock peut être atteinte.';
            this.showErrorPopup = true;
          }
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'Une erreur est survenue lors de l’ajout au panier. La limite de stock peut être atteinte.';
          this.showErrorPopup = true;
        },
      });
    }
  }
}
