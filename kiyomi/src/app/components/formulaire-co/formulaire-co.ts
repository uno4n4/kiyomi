import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulaire-co',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulaire-co.html',
  styleUrl: './formulaire-co.css',
})
export class FormulaireCo implements OnInit {

  email = '';
  password = '';
  errorMessage = '';
  showErrorPopup = false;

  productPending: any = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const pendingId = Number(params['idPanier']);
    const pendingQuantity = Number(params['quantity']) || 1;

    if (!pendingId) {
      return;
    }

    this.http
      .get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php')
      .subscribe({
        next: (res) => {
          const box = res.find(box => box.id === pendingId);
          if (box) {
            // On ajoute la quantité récupérée depuis les queryParams
            this.productPending = {
              ...box,
              quantity: pendingQuantity
            };
          }
        },
        error: (err) => {
          console.error('Erreur produit en attente :', err);
        }
      });
  });
}



  onSubmit() {
    if (!this.email.includes('@')) {
      this.errorMessage = "Votre email est invalide.";
      this.showErrorPopup = true;
      return;
    }

    this.auth.login(this.email, this.password).subscribe(
      (res: any) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

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
        this.errorMessage = "Erreur de connexion.";
        this.showErrorPopup = true;
      }
    );
  }

  // REDIRECTION VERS MDP OUBLIE
  MdpOublie() {
    this.router.navigate(['/app-forgot-password']);
  }

  onImgError(event: any){
    event.target.src = './../../assets/images/boxe_default.jpg';
  }
}
