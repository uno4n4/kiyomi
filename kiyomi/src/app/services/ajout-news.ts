import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AjoutNewsService {
  private API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/newsletter/subscribe.php';

  constructor(private http: HttpClient) {}

  ajouterNewsletter(email: string) {
    return this.http.post<any>(this.API_URL, { email });
  }
}
