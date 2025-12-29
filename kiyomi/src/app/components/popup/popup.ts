import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css'], // petite faute corrigée : styleUrls
})
export class Popup {

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
  }

  rgpd() {
    this.router.navigate(['app-rgpd']);
  }
}

