import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AjoutPanier } from '../../services/ajout-panier';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestion.html',
  styleUrl: './suggestion.css',
})
export class Suggestion {
  apiPanier: any;
  user: any = null;
  box: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private AjoutPanier: AjoutPanier,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const idBox = params['id'];
        this.http.get<any[]>('http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php?id=' + idBox)
          .subscribe({
              next: (response) => {
                  this.box = response; // On stocke les données reçues
              },
              error: (err) => {
                  console.error('Erreur :', err); // Affiche l'erreur dans la console
              }
          });
      }
    );
  }
}