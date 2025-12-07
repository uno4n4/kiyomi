import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeBoxes } from '../../services/liste-boxes';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produit.html',
  styleUrl: './produit.css',
})
export class Produit implements OnInit {

  box: any; // on stocke la box récupérée

  constructor(private listeBoxes: ListeBoxes) {}

  ngOnInit(): void {
    this.listeBoxes.getBoxes().subscribe((data: any[]) => {
      if (data && data.length > 0) {
        this.box = data[0];
      }
    });
  }
}