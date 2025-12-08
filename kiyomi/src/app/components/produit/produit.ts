import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ListeBoxes } from '../../services/liste-boxes';
import { AjoutPanier } from '../../services/ajout-panier';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produit.html',
  styleUrl: './produit.css',
})
export class Produit implements OnInit {
  apiPanier: any;
  user: any = null;
  box: any;

  constructor(
    private listeBoxes: ListeBoxes,
    private route: ActivatedRoute,
    private router: Router,
    private AjoutPanier: AjoutPanier
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // ← id dans l’URL

    this.listeBoxes.getBoxById(id).subscribe((data: any) => {
      this.box = data;
      console.log(this.box);
    });
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
