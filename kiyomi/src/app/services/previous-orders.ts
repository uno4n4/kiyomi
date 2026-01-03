import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreviousOrders {
  private API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/orders/ancienPaniers.php';

  constructor(private http: HttpClient) {}

  getPreviousOrders(userId?: number): Observable<any> {
    console.log('userId reçu dans le service :', userId);
    if (!userId) throw new Error('userId non défini');
    const params = new HttpParams().set('userid', userId.toString());
    return this.http.get<any>(this.API_URL, { params });
  }
}

