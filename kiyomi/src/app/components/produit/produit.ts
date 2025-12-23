import { Component, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AjoutPanier } from '../../services/ajout-panier';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Suggestion } from '../suggestion/suggestion';
import { FildAriane } from '../fild-ariane/fild-ariane';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, Suggestion, FildAriane],
  templateUrl: './produit.html',
  styleUrl: './produit.css',
})
export class Produit implements OnInit {
  apiPanier: any;
  user: any = null;
  box: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private AjoutPanier: AjoutPanier,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const idBox = params['id'];
      this.http
        .get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php?id=' + idBox)
        .subscribe({
          next: (response) => {
            this.box = response; // On stocke les données reçues
          },
          error: (err) => {
            console.error('Erreur :', err); // Affiche l'erreur dans la console
          },
        });
    });
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  }

  //gestion quantite
  quantite: number = 1;
  ajouter() {
    if (this.quantite < 10) {
      this.quantite++;
    }
  }
  retirer() {
    if (this.quantite > 1) {
      this.quantite--;
    }
  }

  //GESTION ERREUR IMAGE
  onImgError(event: any) {
    event.target.src = './../../assets/images/boxe_default.jpg';
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
        queryParams: { idPanier: idPanier, quantity: this.quantite },
      });
    } else {
      const user_id: number = this.user['id'];

      // ON UTILISE MAINTENANT LA VARIABLE DU CURSEUR
      const quantity = this.quantite;

      // On prépare l'objet avec la bonne quantité
      const items: { box_id: number; quantity: number }[] = [{ box_id: idPanier, quantity }];

      this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe({
        next: (response) => {
          if (response.success) {
            this.apiPanier = response;
            this.successMessage = 'Votre commande a bien été prise en compte !';
            this.showSuccessPopup = true;
            console.log(`Ajout de ${quantity} box(es) au panier`); // Pour vérifier dans la console
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

//addPanier(idPanier: number): any {
//if (!this.user) {
//this.router.navigate(['/app-formulaire-co']); //renvoie au component app-formulaire-co
//} else {
//let user_id = this.user['id'];
// Utilisez this.quantite au lieu de 1
//return this.AjoutPanier.ajouterAuPanier(idPanier, this.quantite, user_id, items).subscribe(...);
//}
//}
