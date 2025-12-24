import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FildAriane } from '../fild-ariane/fild-ariane';
import { AjoutPanier } from '../../services/ajout-panier';

@Component({
  selector: 'app-formulaire-co',
  standalone: true,
  imports: [CommonModule, FormsModule, FildAriane],
  templateUrl: './formulaire-co.html',
  styleUrl: './formulaire-co.css',
})
export class FormulaireCo implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showErrorPopup = false;
  showSuccessPopup = false;

  productPending: any = null;
  user: any = null;

  pendingId: number | null = null;
  pendingQuantity = 1;

  constructor(
    private auth: Auth,
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
    if (!this.email.includes('@')) {
      this.errorMessage = 'Votre email est invalide.';
      this.showErrorPopup = true;
      return;
    }

    this.auth.login(this.email, this.password).subscribe(
       (res: any) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.user = res.user;

          //ajout du produit dans le panier
          if(this.pendingId){
            this.addPanier(this.pendingId, this.pendingQuantity);
          }

          // nettoyage du produit en attente
          localStorage.removeItem('pendingProductId');

          this.showErrorPopup = false;
          window.location.reload();
        } else {
          this.errorMessage = res.message || 'Erreur inconnue';
          this.showErrorPopup = true;
        }
      },
      () => {
        this.errorMessage = 'Erreur de connexion.';
        this.showErrorPopup = true;
      }
    );
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

  // REDIRECTION VERS MDP OUBLIE
  MdpOublie() {
    this.router.navigate(['/app-forgot-password']);
  }

  Inscription() {
    this.router.navigate(['/app-formulaire-inscription'], { queryParams: { idPanier: this.pendingId },
      });
  }

  onImgError(event: any) {
    event.target.src = './../../assets/images/boxe_default.jpg';
  }
}
