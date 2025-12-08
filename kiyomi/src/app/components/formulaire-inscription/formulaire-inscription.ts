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
  status = '';
  errorMessage = '';
  showErrorPopup = false;

  constructor (private inscription: Inscription){}

  onSubmit() {
    const strongPassword = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if(!strongPassword.test(this.password)){
      this.errorMessage = "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre";
      this.showErrorPopup = true;
      return
    }
  this.inscription.add_user(this.firstname, this.lastname, this.email, this.password, this.status)
    .subscribe({
      next: (res) => {
        if (res.success) {
          // Stockage du token et de l'utilisateur
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          console.log("Connecté :", res.user.prenom, res.user.nom);
          window.location.reload();
        } else {
          this.errorMessage = res.message;
          this.showErrorPopup = true;
        }
      },
      error: (err) => {
          this.errorMessage = "Erreur serveur ou connexion impossible.";
          this.showErrorPopup = true;
        }
      });
    }
}
