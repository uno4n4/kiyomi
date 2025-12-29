<<<<<<< Updated upstream
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
=======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
>>>>>>> Stashed changes
import { Router } from '@angular/router';
import { Rgpd } from '../rgpd/rgpd';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css'], // petite faute corrigée : styleUrls
})
export class Popup {
<<<<<<< Updated upstream

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 🔹 Affichage du popup panier
  get showPopup(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return localStorage.getItem('panier') !== null;
  }

  // 🔹 RGPD
  acceptCookies() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookieChoice', 'accepted');
    }
  }

  refuseCookies() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookieChoice', 'refused');
    }
=======
  constructor(private router: Router) {}

  // Getter sécurisé pour SSR
  get showPopup(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false; // côté serveur, on ne montre rien
    }
    return !localStorage.getItem('cookieChoice');
  }

  acceptCookies() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('cookieChoice', 'accepted');
  }

  refuseCookies() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem('cookieChoice', 'refused');
>>>>>>> Stashed changes
  }

  rgpd() {
    this.router.navigate(['app-rgpd']);
  }
}

