import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// import { ListeBoxes } from '../../services/liste-boxes';
import { AjoutPanier } from '../../services/ajout-panier';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule],
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
  

  //btn ajout panier
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
