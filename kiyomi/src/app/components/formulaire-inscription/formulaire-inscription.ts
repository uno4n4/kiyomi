import { Component } from '@angular/core';
import { Inscription } from '../../services/inscription';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-formulaire-inscription',
  imports: [CommonModule, FormsModule],
  templateUrl: './formulaire-inscription.html',
  styleUrl: './formulaire-inscription.css',
})
export class FormulaireInscription {
  firstname = ''; 
  lastname = '';
  email = '';
  password = '';
  error = '';

  constructor (private inscription: Inscription){}

  onSubmit() {
  this.inscription.add_user(this.firstname, this.lastname, this.email, this.password)
    .subscribe({
      next: (res) => {
        if (res.success) {
          // Stockage du token et de l'utilisateur
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          console.log("Connecté :", res.user.prenom, res.user.nom);
          window.location.reload();
        }
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = "Un utilisateur avec cet email existe déjà.";
        } else {
          this.error = "Erreur serveur ou connexion impossible.";
        }
        console.error('Erreur API :', err);
      }
    });
}


}
