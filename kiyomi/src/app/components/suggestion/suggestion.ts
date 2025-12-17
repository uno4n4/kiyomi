import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { AjoutPanier } from '../../services/ajout-panier';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestion.html',
  styleUrl: './suggestion.css',
})
export class Suggestion implements OnInit {
  // Le tableau qui contiendra les 3 boxes choisies
  boxes: any[] = [];
  apiPanier: any;
  user: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private AjoutPanier: AjoutPanier
  ) {}

  ngOnInit(): void {
    // Le composant va chercher les données tout seul au chargement
    this.http.get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php').subscribe({
      next: (allBoxes) => {
        const idsVoulus = [1, 12, 13];
        // On filtre pour ne garder que les 3 boxes spécifiques
        this.boxes = allBoxes.filter(
          (item) => idsVoulus.includes(Number(item.id)) || idsVoulus.includes(Number(item.id_box))
        );
      },
      error: (err) => console.error('Erreur suggestions autonomes:', err),
    });
  }

  // Permet de changer de page si on clique sur une suggestion
  voirProduit(id: number): void {
    this.router
      .navigate(['/app-produit'], {
        queryParams: { id: id },
      });
  }

  // AJOUT PANIER EN FONCTION DE LA CONNECTION USER
  addPanier(idPanier: number): any {
    if (!this.user) {
      this.router.navigate(['/app-formulaire-co']); //renvoie au component app-formulaire-co
    } else {
      //sinon on ajoute la boxe au panier de l'user
      let user_id: number = this.user['id'];
      const quantity = 1; // par défaut

      const items = [{ idPanier, quantity }]; //comme on ajoute dans le panier 1par1 au clic du bouton commander
      return this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe(
        (panier) => {
          this.apiPanier = panier; //stockage des données reçues dans la variable
        }
      );
    }
  }
}
