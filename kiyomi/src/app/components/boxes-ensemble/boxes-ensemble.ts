import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ListeBoxes } from '../../services/liste-boxes';
import { AjoutPanier } from '../../services/ajout-panier';
import { SearchTerm } from '../../services/search-term';
import { Searching } from '../../services/searching';
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
  apiListe: any[] = [];
  apiRecherche: any[] = [];
  apiPanier: any;

  user: any = null;
  accueil = false;
  termedeRecherche = ''; //terme initialisé vide un service va le remplir
  //AFFICHAGE PAR 6 DES DIFFERENTES BOXES
  visibleBoxes = 6;

  // Variables pour les popups
  showErrorPopup = false;
  errorMessage = '';
  showSuccessPopup = false;
  successMessage = '';
  private isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private listeBoxes: ListeBoxes,
    private AjoutPanier: AjoutPanier,
    private searchTerm: SearchTerm,
    private searching: Searching,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  //injection du parametre pour la connexion - des services - du router pour les redirections

  // FILTRES
  //applyFilters(filters: any) {
  /// this.listeBoxes.getBoxes(filtres).subscribe((menus) => {
  //  this.apiListe = menus;
  //  this.visibleBoxes = 6;
  //  });
  // }

  ngOnInit(): void {
    this.getDataFromAPI(); //appel de la methode au chargement du composant
    this.getDataFromSearchAPI();

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

  get boxesToShow() {
    const affichage = this.termedeRecherche ? this.apiRecherche : this.apiListe;
    return affichage.slice(0, this.visibleBoxes);
  }

  //VERIFIEE SI IL RESTE DES BOXES A AFFICHER
  get totalBoxPositive() {
    const affichage = this.termedeRecherche ? this.apiRecherche : this.apiListe;
    return affichage.length > 0 && this.visibleBoxes < affichage.length;
  }

  voirPlus() {
    this.visibleBoxes += 6;
  }

  //GESTION ERREUR IMAGE
  onImgError(e: any): void {
    e.target.src = 'assets/images/boxe_default.jpg';
  }

  // charger l'API pour éviter que totalBoxPositive reste à 0 au reload
  getDataFromAPI() {
    this.listeBoxes.getBoxes().subscribe((menus) => {
      this.apiListe = menus;
    });
  }

  getDataFromSearchAPI(): void {
    //abonnement aux changements du terme de recherche
    this.searchTerm.search$.subscribe((term) => {
      this.termedeRecherche = term; //mise à jour du terme de recherche avec la recuperation du service searchTerm
      this.visibleBoxes = 6; // reset affichage

      this.searching.rechercheEnCours(term).subscribe((res) => {
        this.apiRecherche = res.success ? res.match : [];
      });
    });
  }

  // ========================
  // PANIER
  // ========================
  addPanier(idPanier: number): void {
    if (!this.user) {
      this.router.navigate(['/app-formulaire-co'], {
        queryParams: { idPanier },
      });
      return;
    }

    const box = this.apiListe.find((b) => b.id === idPanier);
    if (!box) return;

    if (!this.isBrowser) return;
    const panier = JSON.parse(localStorage.getItem('panier') || '[]');
    const existant = panier.find((p: any) => p.id === box.id);

    if (existant) {
      existant.quantity += 1;
    } else {
      panier.push({
        id: box.id,
        name: box.name,
        price: box.price,
        image: box.image,
        quantity: 1,
      });
    }

    localStorage.setItem('panier', JSON.stringify(panier));
    this.successMessage = 'Box ajoutée au panier !';
    this.showSuccessPopup = true;

    //partie bdd
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
          err?.error?.message ||
          'Une erreur est survenue lors de l’ajout au panier. La limite de stock peut être atteinte.';
        this.showErrorPopup = true;
      },
    });
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }
}
