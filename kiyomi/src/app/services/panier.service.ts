import { Injectable } from '@angular/core';

export interface PanierItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  private panier: PanierItem[] = [];

  getPanier() {
    return this.panier;
  }

  ajouter(item: PanierItem) {
    const exist = this.panier.find(p => p.id === item.id);

    if (exist) {
      exist.quantity += item.quantity;
    } else {
      this.panier.push(item);
    }
  }

  supprimer(id: number) {
    this.panier = this.panier.filter(p => p.id !== id);
  }

  vider() {
    this.panier = [];
  }
}
