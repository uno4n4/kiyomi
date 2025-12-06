import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produit.html',
  styleUrl: './produit.css',
})
export class Produit {
  showInfos = false; // masqué au début

  toggleInfos() {
    this.showInfos = !this.showInfos;
  }

}
