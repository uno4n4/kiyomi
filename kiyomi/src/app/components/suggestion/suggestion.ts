import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AjoutPanier } from '../../services/ajout-panier';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestion.html',
  styleUrl: './suggestion.css',
})
export class Suggestion implements OnInit {
  boxes: any[] = [];
  apiPanier: any;
  user: any = null;
  bggrey: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private AjoutPanier: AjoutPanier
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }

    this.http.get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php').subscribe({
      next: (allBoxes) => {
        const idsVoulus = [2, 12, 13];
        this.boxes = allBoxes.filter(
          (item) => idsVoulus.includes(Number(item.id)) || idsVoulus.includes(Number(item.id_box))
        );
      },
      error: (err) => console.error('Erreur suggestions autonomes:', err),
    });
    if(this.router.url.includes('app-restaurant') || this.router.url.includes('app-panier')|| this.router.url.includes('app-compte-user')) {
      this.bggrey = true;
    } else {
      this.bggrey = false;
    }
  }

  //GESTION ERREUR IMAGE
  onImgError(event: any) {
    event.target.src = './../../assets/images/boxe_default.jpg';
  }

  voirProduit(id: number): void {
    this.router.navigate(['/app-produit'], { queryParams: { id } });
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
