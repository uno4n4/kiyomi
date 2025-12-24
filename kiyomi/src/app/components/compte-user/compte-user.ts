import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Suggestion } from '../suggestion/suggestion';
import { FildAriane } from '../fild-ariane/fild-ariane';


@Component({
  selector: 'app-compte-user',
  imports: [CommonModule, FormsModule, Suggestion, FildAriane],
  templateUrl: './compte-user.html',
  styleUrl: './compte-user.css',
})
export class CompteUser {
  user: any = {};
  email: string = '';
  password: string = '';

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // On récupère l'utilisateur depuis le localStorage
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.email = this.user.email;
  }

  updateUser() {
  const body = {
    id: this.user.id,        // obligatoire
    email: this.email,       // obligatoire
    password: this.password  // facultatif
  };

  console.log('Body envoyé:', body);

  this.http.post('http://localhost/kiyomi/kiyomi/sushi_box/api/users/update-user.php', body)
    .subscribe(
      (res: any) => {
        if (res.success) {
          this.successMessage = 'Votre compte a été mis à jour.';
          this.errorMessage = '';
          this.user.email = this.email;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          this.errorMessage = res.message || 'Erreur inconnue';
          this.successMessage = '';
        }
      },
      (err) => {
        console.error('Erreur serveur:', err); // 🔍 log détaillé
        this.errorMessage = 'Erreur serveur.';
        this.successMessage = '';
      }
    );
}
}