import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Rgpd } from '../rgpd/rgpd';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, Rgpd],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup {
  constructor(private router: Router){}

  get showPopup(): boolean {
    return !localStorage.getItem('cookieChoice');
  }

  acceptCookies(){
    localStorage.setItem('cookieChoice', 'accepted');
  }

  refuseCookies() {
        localStorage.setItem('cookieChoice', 'refused');
  }

  rgpd(){
    this.router.navigate(['app-rgpd']);
  }

}
