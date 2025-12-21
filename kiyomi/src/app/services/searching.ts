import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Searching {
  API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/filters/rechercher.php';

  constructor(private http: HttpClient) {}

  rechercheEnCours(recherche: String) {
    //recupération de l'input necessaire pour la requete
    return this.http.post<any>(this.API_URL, { recherche });
  }
}
