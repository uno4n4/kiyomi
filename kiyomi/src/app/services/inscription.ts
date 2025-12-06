import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Inscription {
  apiUrl = "http://localhost/SAE301/kiyomi/sushi_box/api/users/add_user.php";

  constructor(private http: HttpClient){}

  add_user(firstname: string, lastname: string, email: string, password: string, status: string): Observable<any> {
  return this.http.post(this.apiUrl, {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    status: status
  }).pipe(
    tap((response: any) => {
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      }
    })
  );
}

}
