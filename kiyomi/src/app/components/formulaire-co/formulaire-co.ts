import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
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
  error = '';

  constructor(private auth: Auth) {}

  onSubmit(){
    this.auth.login(this.email, this.password).subscribe(res => {
      if(res.success){
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        console.log("Connecté :", res.user.prenom, res.user.nom);
      } else {
        this.error = "Identifiants incorrects";
      }
    },
    err => {
      this.error = "Erreur de connexion";
    }
  )
  }
}
