import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FildAriane } from '../fild-ariane/fild-ariane';
import { Suggestion } from '../suggestion/suggestion';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FildAriane, Suggestion],
  templateUrl: './panier.html',
  styleUrl: './panier.css',
})
export class Panier implements OnInit {

  items: any[] = [];
  serviceFee = 2.5;

  ngOnInit(): void {
    const storedPanier = localStorage.getItem('panier');
    this.items = storedPanier ? JSON.parse(storedPanier) : [];
  }

  // ➕ Augmenter quantité
  increase(item: any): void {
    item.quantity++;
    this.savePanier();
  }

  // ➖ Diminuer quantité
  decrease(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.items = this.items.filter(i => i !== item);
    }
    this.savePanier();
  }

  // ➕ PRODUITS COMPLÉMENTAIRES
  addComplement(type: string): void {
    const complements: any = {
      baguette: {
        name: 'Paires de baguettes jetables',
        price: 0,
        quantity: 1,
        image: 'baguette'
      },
      mouchoir: {
        name: 'Serviettes en papier',
        price: 0,
        quantity: 1,
        image: 'mouchoirs'
      },
      serviette: {
        name: 'Sauces (sucrée, salée et soja)',
        price: 0,
        quantity: 1,
        image: 'serviette'
      }
    };

    const product = complements[type];
    if (!product) return;

    const existing = this.items.find(i => i.name === product.name);

    if (existing) {
      existing.quantity++;
    } else {
      this.items.push(product);
    }

    this.savePanier();
  }

  // 💾 Sauvegarde
  savePanier(): void {
    localStorage.setItem('panier', JSON.stringify(this.items));
  }

  // 💰 Sous-total
  get subtotal(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // 💳 Total
  get total(): number {
    return this.subtotal + this.serviceFee;
  }
}


