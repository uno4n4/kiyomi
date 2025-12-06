import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkWithHref],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

}
