import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Suggestion } from '../suggestion/suggestion';
import { FildAriane } from '../fild-ariane/fild-ariane';
import { PreviousOrders } from '../../services/previous-orders';

@Component({
  selector: 'app-compte-user',
  imports: [CommonModule, FormsModule, Suggestion, FildAriane],
  templateUrl: './compte-user.html',
  styleUrl: './compte-user.css',
})
export class CompteUser {
  user: any = {};
  email: string = '';
  password: string = '';

  Nomboxe: any;
  apiAnciensPanier: any[] = [];

  successMessage = '';
  errorMessage = '';

  openclosetab = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private previousOrders: PreviousOrders // camelCase
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.email = this.user.email || '';
      } else {
        console.warn('pas d\'user dans le localStorage');
        this.user = {};
      }
    }

    if (this.user?.id) {
      this.showAnciensPaniers(this.user.id);
    } else {
      console.warn('user.id est undefined');
    }
  }

  loadBox(item: any) {
    this.http
      .get<any>(
        'http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php?id=' +
          item.box_id
      )
      .subscribe({
        next: (response) => {
          item.box = response;
        },
        error: (err) => console.error(err),
      });
  }

  updateUser() {
    const body = {
      id: this.user.id,
      email: this.email,
      password: this.password,
    };

    this.http
      .post(
        'http://localhost/kiyomi/kiyomi/sushi_box/api/users/update-user.php',
        body
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.successMessage = 'Votre compte a été mis à jour.';
            this.errorMessage = '';
            this.user.email = this.email;
            localStorage.setItem('user', JSON.stringify(this.user));
          } else {
            this.errorMessage = res.message || 'Erreur inconnue';
            this.successMessage = '';
          }
        },
        (err) => {
          console.error('Erreur serveur:', err);
          this.errorMessage = 'Erreur serveur.';
          this.successMessage = '';
        }
      );
  }

  showAnciensPaniers(userId: number) {
    this.previousOrders.getPreviousOrders(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.apiAnciensPanier = res.anciensPaniers;

          // Charger les boxes pour chaque item
          this.apiAnciensPanier.forEach((order: any) => {
            order.items.forEach((item: any) => this.loadBox(item));
          });

          console.log('Anciens paniers chargés :', this.apiAnciensPanier);
        } else {
          console.error('Erreur API');
        }
      },
      error: (err) => console.error('Erreur HTTP', err),
    });
  }
}
