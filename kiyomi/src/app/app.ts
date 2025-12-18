import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // petite typo corrigée : styleUrl → styleUrls
})
export class App implements OnInit {
  protected readonly title = signal('kiyomi');
  user: any = null;
  pageFondBlanc: string[] = ['/app-formulaire', '/app-panier', '/app-formulaire-inscription', '/app-compte-user','/app-forgot-password', '/app-formulaire-co', '/app-restaurant' ];
  accueil = false;
  nav = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) this.user = JSON.parse(savedUser);
    }
    if (!isPlatformBrowser(this.platformId)) return;

    const updateStyles = () => {
      const current = this.router.url;

      // Body background
      if (this.pageFondBlanc.includes(current)) {
        this.renderer.setStyle(document.body, 'background-color', 'white');
        this.nav = true;
      } else {
        this.renderer.setStyle(document.body, 'background-color', 'black');
        this.nav = false;
      }

      // Image chef accueil
      if (
        current.includes('/app-accueil') || current.includes('/app-rgpd') || 
        window.location.href === 'http://localhost:4200' ||
        window.location.href === 'http://localhost:4200/'
      ) {
        this.accueil = true;
      } else {
        this.accueil = false;
      }
    };

    // Initial update
    updateStyles();

    // À chaque changement de route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        updateStyles();
      }
    });
  }

  //REDIRECTION VERS LA "PAGE MENU"
  renvoiMenu() {
    this.router.navigate(['/app-menu']); //renvoie au component menu
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.user = null;
  }
}
