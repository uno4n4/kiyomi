import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BoxesService {
  constructor(private http: HttpClient) {}

  getBoxes(filters?: any): Observable<any[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((k) => {
        const v = filters[k];
        if (v !== null && v !== undefined && v !== '') {
          params = params.set(k, v);
        }
      });
    }

    return this.http.get<any[]>(
      'http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/index.php',
      { params }
    );
  }
}
