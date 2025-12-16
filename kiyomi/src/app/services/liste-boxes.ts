import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//utilisation dans produit(accueil) et box individuelles
@Injectable({
  providedIn: 'root',
})
export class ListeBoxes {
  API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/boxes';

  constructor(private http: HttpClient) {}
  getBoxes(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL); //observable - recuperation de toutes les boxes via l'API
  }
  getBoxById(id: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.API_URL}/${id}`);
  }
}
