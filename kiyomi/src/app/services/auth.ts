import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = "http://localhost/SAE301/kiyomi/sushi_box/api/users/login.php";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      email: email,
      password: password
    }).pipe(
      tap((response: any) => {
        if (response.success) {
          // 👉 On stocke l'utilisateur
          localStorage.setItem('user', JSON.stringify(response.user));

          // 👉 Et le token si tu veux l'utiliser plus tard
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
}
