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
  termedeRecherche = '';
  visibleBoxes = 6;

  showErrorPopup = false;
  errorMessage = '';
  showSuccessPopup = false;
  successMessage = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private listeBoxes: ListeBoxes,
    private ajoutPanier: AjoutPanier,
    private searchTerm: SearchTerm,
    private searching: Searching,
    private router: Router,
  ) {}

  // ========================
  // LIFECYCLE
  // ========================
  ngOnInit(): void {
    this.getDataFromAPI();
    this.getDataFromSearchAPI();

    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) this.user = JSON.parse(savedUser);

      const url = this.router.url;
      this.accueil =
        url === '/' ||
        url === '/app-accueil' ||
        window.location.href === 'http://localhost:4200/';
    }
  }

  ngAfterViewInit(): void {}

  // ========================
  // NAVIGATION (FIX ERREUR)
  // ========================
  pageProduit(id: number): void {
    this.router.navigate(['/app-produit'], {
      queryParams: { id },
    });
  }

  renvoiMenu(): void {
    this.router.navigate(['/app-menu']);
  }

  // ========================
  // DATA
  // ========================
  get boxesToShow() {
    const source = this.termedeRecherche ? this.apiRecherche : this.apiListe;
    return source.slice(0, this.visibleBoxes);
  }

  get totalBoxPositive() {
    const source = this.termedeRecherche ? this.apiRecherche : this.apiListe;
    return this.visibleBoxes < source.length;
  }

  voirPlus(): void {
    this.visibleBoxes += 6;
  }

  onImgError(e: any): void {
    e.target.src = 'assets/images/boxe_default.jpg';
  }

  getDataFromAPI(): void {
    this.listeBoxes.getBoxes().subscribe(data => {
      this.apiListe = data;
    });
  }

  getDataFromSearchAPI(): void {
    this.searchTerm.search$.subscribe(term => {
      this.termedeRecherche = term;
      this.visibleBoxes = 6;

      this.searching.rechercheEnCours(term).subscribe(res => {
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

    const box = this.apiListe.find(b => b.id === idPanier);
    if (!box) return;

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
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }
}
