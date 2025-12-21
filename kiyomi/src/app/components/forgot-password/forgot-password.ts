import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FildAriane } from '../fild-ariane/fild-ariane';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, FildAriane],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email = '';
  errorMessage = '';
  successMessage = '';
  showSuccessPopup = false;
  showErrorPopup = false;

  constructor(private auth: Auth) {}
  onSubmit() {
  this.auth.forgotPassword(this.email).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.successMessage = "Un email de réinitialisation vous a été envoyé.";
        this.showSuccessPopup = true;
      } else {
        this.errorMessage = res.message;
        this.showErrorPopup = true;
      }
    },
    error: () => {
      this.errorMessage = "Erreur serveur.";
      this.showErrorPopup = true;
    }
  });
}


}
