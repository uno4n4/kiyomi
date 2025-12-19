import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup {
  showPopup = true;

  acceptCookies(): void{
    this.showPopup = false;
  }

  refuseCookies(): void {
    this.showPopup = false;
  }

}
