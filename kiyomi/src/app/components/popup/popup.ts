import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get showPopup(): boolean {
    if (!this.isBrowser) return false;
    return !localStorage.getItem('cookieChoice');
  }

  acceptCookies(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('cookieChoice', 'accepted');
  }

  refuseCookies(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('cookieChoice', 'refused');
  }

  rgpd(): void {
    this.router.navigate(['app-rgpd']);
  }
}