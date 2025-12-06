import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeBoxes } from '../../services/liste-boxes'; //import du service de recuperation des boxes
import { AjoutPanier } from '../../services/ajout-panier'; //import du service d'ajout de boxes dans le panier
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  apiListe: any[] = []; //variable pour stocker les données de l'API
  apiPanier: any;

  constructor(private listeBoxes: ListeBoxes, private AjoutPanier: AjoutPanier) {} //injection du service

  ngOnInit(): void {
    this.getDataFromAPI(); //appel de la methode au chargement du composant
  }

  getDataFromAPI() {
    return this.listeBoxes.getBoxes().subscribe((menus) => {
      this.apiListe = menus; //stockage des données reçues dans la variable
    });
  }

  addPanier(idPanier: number) {
    const quantity = 1; // par défaut
    //const user_id = this.user_id; // à récuperer
    const user_id = 1;

    const items = [{ idPanier, quantity }]; //comme on ajoute dans le panier 1par1 au clic du bouton commander
    return this.AjoutPanier.ajouterAuPanier(idPanier, quantity, user_id, items).subscribe(
      (panier) => {
        this.apiPanier = panier; //stockage des données reçues dans la variable
      }
    );
  }
}
