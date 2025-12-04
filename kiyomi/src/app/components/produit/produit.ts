import { Component } from '@angular/core';

@Component({
  selector: 'app-produit',
  imports: [],
  templateUrl: './produit.html',
  styleUrl: './produit.css',
})
export class Produit {

  showInfos = false; // masqué au début

  toggleInfos() {
    this.showInfos = !this.showInfos;
  }

}
