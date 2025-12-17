import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Le composant va chercher les données tout seul au chargement
    this.http.get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php')
      .subscribe({
        next: (allBoxes) => {
          const idsVoulus = [1, 12, 13];
          // On filtre pour ne garder que les 3 boxes spécifiques
          this.boxes = allBoxes.filter(item => 
            idsVoulus.includes(Number(item.id)) || idsVoulus.includes(Number(item.id_box))
          );
        },
        error: (err) => console.error('Erreur suggestions autonomes:', err)
      });
  }

  // Permet de changer de page si on clique sur une suggestion
  voirProduit(id: number): void {
    this.router.navigate(['/produit'], { queryParams: { id: id } });
  }
}