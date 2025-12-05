import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeBoxes } from '../../services/liste-boxes'; //import du service de recuperation des boxes
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  apiData: any[] = []; //variable pour stocker les données de l'API

  constructor(private listeBoxes: ListeBoxes) {} //injection du service

  ngOnInit(): void {
    this.getDataFromAPI(); //appel de la methode au chargement du composant
  }

  getDataFromAPI() {
    return this.listeBoxes.getBoxes().subscribe((menus) => {
      this.apiData = menus; //stockage des données reçues dans la variable
    });
    }
}
