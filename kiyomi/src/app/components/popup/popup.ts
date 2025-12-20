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

  showPopup = true;

  acceptCookies(): void{
    this.showPopup = false;
  }

  refuseCookies(): void {
    this.showPopup = false;
  }

  rgpd(){
    this.router.navigate(['app-rgpd']);
  }

}
