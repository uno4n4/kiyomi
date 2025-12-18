import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup implements OnInit {
  showPopup = true;
  ngOnInit(): void {
    const consent = localStorage.getItem('cookiesAccepted');
    if (consent){
      this.showPopup = false;
    }
  }

  acceptCookies(): void{
    localStorage.setItem('cookiesAccepted', 'true');
    this.showPopup = false;
  }

}
