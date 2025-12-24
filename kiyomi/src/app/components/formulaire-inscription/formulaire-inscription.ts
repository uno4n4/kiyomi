import { Component, OnInit } from '@angular/core';
import { Inscription } from '../../services/inscription';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FildAriane } from '../fild-ariane/fild-ariane';
import { AjoutPanier } from '../../services/ajout-panier';

@Component({
  selector: 'app-formulaire-inscription',
  imports: [CommonModule, FormsModule, FildAriane],
  templateUrl: './formulaire-inscription.html',
  styleUrl: './formulaire-inscription.css',
})
export class FormulaireInscription implements OnInit {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  status = '';
  errorMessage = '';
  successMessage = '';
  showErrorPopup = false;
  showSuccessPopup = false;

  productPending: any = null;
  user: any = null;
  pendingId: number | null = null;
  pendingQuantity = 1;

  constructor(
    private inscription: Inscription,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private AjoutPanier: AjoutPanier
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.pendingId = Number(params['idPanier']);
      this.pendingQuantity = Number(params['quantity']) || 1;

      if (!this.pendingId) {
        return;
      }

      this.http
        .get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php')
        .subscribe({
          next: (res) => {
            const box = res.find((box) => box.id === this.pendingId);
            if (box) {
              // On ajoute la quantité récupérée depuis les queryParams
              this.productPending = {
                ...box,
                quantity: this.pendingQuantity,
              };
            }
          },
          error: (err) => {
            console.error('Erreur produit en attente :', err);
          },
        });
    });
  }

  onSubmit() {
    const strongPassword = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!strongPassword.test(this.password)) {
      this.errorMessage =
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre';
      this.showErrorPopup = true;
      return;
    }

    this.inscription
      .add_user(this.firstname, this.lastname, this.email, this.password, this.status)
      .subscribe({
        next: (res) => {
          if (res.success) {
            // Stockage du token et de l'utilisateur
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.user = res.user;

            //ajout du produit dans le panier
          if(this.pendingId){
            this.addPanier(this.pendingId, this.pendingQuantity);
          }

            this.successMessage = `Inscription réussie ! Bienvenue ${res.user.prenom}`;
            this.showSuccessPopup = true;

            this.firstname = '';
            this.lastname = '';
            this.email = '';
            this.status = '';
            this.password = '';

            console.log('Connecté :', res.user.prenom, res.user.nom);
            window.location.reload();
          } else {
            this.errorMessage = res.message;
            this.showErrorPopup = true;
          }
        },
        error: (err) => {
          this.errorMessage = 'Erreur serveur ou connexion impossible.';
          this.showErrorPopup = true;
        },
      });
  }

  //fonction d'ajout au panier
  addPanier(idPanier: number, quantity: number): void {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return;

    this.user = JSON.parse(savedUser);
    const user_id: string = this.user.id;

    const items = [{ box_id: idPanier, quantity }];

    this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Votre commande a bien été prise en compte !';
          this.showSuccessPopup = true;
        } else {
          this.errorMessage =
            response.error ||
            'Impossible d’ajouter la box au panier. La limite de stock peut être atteinte.';
          this.showErrorPopup = true;
        }
      },
    });
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  dejaCompte() {
    this.router.navigate(['/app-formulaire-co'], { queryParams: { idPanier: this.pendingId } });
  }

  onImgError(event: any) {
    event.target.src = './../../assets/images/boxe_default.jpg';
  }
}
