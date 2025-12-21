import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  apiUrl = "http://localhost/kiyomi/kiyomi/sushi_box/api/users";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "/login.php", {
      email: email,
      password: password
    }).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.user));

          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  forgotPassword(email: string){
    return this.http.post<any>(this.apiUrl + "/forgot-password.php", { email });
  }

}
