import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AjoutNewsService } from '../../services/ajout-news';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  user: any = null;
  email = '';

  showErrorPopup = false;
  errorMessage = '';
  showSuccessPopup = false;
  successMessage = '';

  constructor(
    private router: Router,
    private ajoutNews: AjoutNewsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.email = this.user.email; // auto-remplissage
      }
    }
  }

  renvoi(chemin: string) {
    this.router.navigate([chemin]);
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
    this.errorMessage = '';
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.successMessage = '';
  }

  AddNewsletter() {
    if (!this.email) {
      this.errorMessage = 'Veuillez renseigner un email valide.';
      this.showErrorPopup = true;
      return;
    }

    this.ajoutNews.ajouterNewsletter(this.email).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Vous êtes maintenant inscrit à notre newsletter !';
          this.showSuccessPopup = true;
        } else {
          this.errorMessage = response.error || 'Une erreur est survenue.';
          this.showErrorPopup = true;
        }
      },
      error: () => {
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.showErrorPopup = true;
      },
    });
  }
}