import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//utilisation dans produit(accueil) et box individuelles
@Injectable({
  providedIn: 'root',
})
export class ListeBoxes {
  API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/boxes';

  constructor(private http: HttpClient) {}
  getBoxes() {
    return this.http.get<any[]>(this.API_URL); //observable - recuperation de toutes les boxes via l'API
  }
}
