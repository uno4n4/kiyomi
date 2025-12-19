import { Component, Inject, Input, OnInit, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Footer } from './components/footer/footer';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('kiyomi');
  user: any = null;
  pageFondBlanc: string[] = [
    '/app-panier',
    '/app-formulaire-inscription',
    '/app-compte-user',
    '/app-forgot-password',
    '/app-formulaire-co',
    '/app-restaurant',
  ];
  @Input() horizontal: boolean = false;
  accueil: boolean = false;
  nav = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route.firstChild;

      while (currentRoute?.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.accueil = currentRoute?.snapshot.data['accueil'] ?? false;

      console.log('AppComponent accueil =', this.accueil);
    });
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
      } else {
        this.renderer.setStyle(document.body, 'background-color', 'black');
      }
      if (current != '/app-accueil') {
        this.nav = true;
      }
      else {
        this.nav = false; //CHANGER LA NAV QUAND ON SWIPE
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
