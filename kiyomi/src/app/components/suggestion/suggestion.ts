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

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private AjoutPanier: AjoutPanier
  ) {}

  ngOnInit(): void {
    // ✅ évite les erreurs SSR/prerender
    if (!isPlatformBrowser(this.platformId)) return;

    this.http
      .get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php')
      .subscribe({
        next: (allBoxes) => {
          const idsVoulus = [2, 12, 13];
          this.boxes = allBoxes.filter(
            (item) =>
              idsVoulus.includes(Number(item.id)) ||
              idsVoulus.includes(Number(item.id_box))
          );
        },
        error: (err) => console.error('Erreur suggestions autonomes:', err),
      });
  }

  voirProduit(id: number): void {
    this.router.navigate(['/app-produit'], { queryParams: { id } });
  }

  addPanier(idPanier: number): any {
    if (!this.user) {
      this.router.navigate(['/app-formulaire-co']);
    } else {
      const user_id: number = this.user['id'];
      const quantity = 1;
      const items = [{ idPanier, quantity }];

      return this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe(
        (panier) => (this.apiPanier = panier)
      );
    }
  }
}
