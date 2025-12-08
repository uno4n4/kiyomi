import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ListeBoxes } from '../../services/liste-boxes';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produit.html',
  styleUrl: './produit.css',
})
export class Produit implements OnInit {

  box: any;

  constructor(
    private listeBoxes: ListeBoxes,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // ← id dans l’URL

    this.listeBoxes.getBoxById(id).subscribe((data: any) => {
      this.box = data;
      console.log(this.box);
    });
  }
}
