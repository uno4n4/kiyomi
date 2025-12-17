import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulaire-co',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulaire-co.html',
  styleUrl: './formulaire-co.css',
})
export class FormulaireCo {
  email = '';
  password = '';
  errorMessage = '';
  showErrorPopup = false;

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    if(!this.email.includes('@')){
      this.errorMessage = "Votre email est invalide.";
      this.showErrorPopup = true;
      return;
    } 

  this.auth.login(this.email, this.password).subscribe(
    (res: any) => {
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.showErrorPopup = false;
        window.location.reload();
      } else {
        this.errorMessage = res.message || 'Erreur inconnu';
        this.showErrorPopup = true;
      }
    },
    (err) => {
      this.errorMessage = "Erreur de connexion.";
      this.showErrorPopup = true;
    }
  );
}

//REDIRECTION VERS LA "PAGE MDP OUBLIE"
  MdpOublie() {
    this.router.navigate(['/app-forgot-password']); //renvoie au component menu
  }

}
