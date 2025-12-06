import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AjoutPanier {

  API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/orders';

  constructor(private http: HttpClient) {}

  ajouterAuPanier(
    box_id: number,
    quantity: number,
    user_id: number,
    items: any[]
  ) { //parametres affiliés au données post necessaire pour le requete
    const body = {
      box_id,
      quantity,
      user_id,
      items
    };

    return this.http.post<any>(this.API_URL, body); //on envoi les donnees par post
  }
}