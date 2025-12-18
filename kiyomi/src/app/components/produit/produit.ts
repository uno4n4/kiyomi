import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// import { ListeBoxes } from '../../services/liste-boxes';
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
export class Produit {
  apiPanier: any;
  user: any = null;
  box: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private AjoutPanier: AjoutPanier,
    private http: HttpClient
  ) {}

//ngOnInit(): void {
  // Utilisez queryParamMap si l'ID est dans l'URL après un '?' (ex: ?id=1)
  //const idString = this.route.snapshot.queryParamMap.get('id');
  //const id = Number(idString);

  //console.log('ID récupéré:', id); // Vérifiez que c'est bien 1

  //if (id && id > 0) { // On vérifie que l'ID est supérieur à 0
  //  this.listeBoxes.getBoxById(id).subscribe((data: any) => {
  //    this.box = data;
  //    console.log(this.box);
  //  });
  //} else {
  //  console.error("ID de produit invalide ou manquant. Vérifiez la route Angular.");
 // }
//}

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

 // btn ajout panier
addPanier(idPanier: number): any {
  if (!this.user) {
    this.router.navigate(['/app-formulaire-co']);
  } else {
    let user_id: number = this.user['id'];
    
    // ON UTILISE MAINTENANT LA VARIABLE DU CURSEUR
    const quantity = this.quantite; 

    // On prépare l'objet avec la bonne quantité
    const items = [{ idPanier, quantity }]; 

    return this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe(
      (panier) => {
        this.apiPanier = panier;
        console.log(`Ajout de ${quantity} box(es) au panier`); // Pour vérifier dans la console
      }
    );
  }
} }



//addPanier(idPanier: number): any {
  //if (!this.user) {
    //this.router.navigate(['/app-formulaire-co']); //renvoie au component app-formulaire-co
  //} else {
    //let user_id = this.user['id'];
    // Utilisez this.quantite au lieu de 1
    //return this.AjoutPanier.ajouterAuPanier(idPanier, this.quantite, user_id, items).subscribe(...);
  //}
//}