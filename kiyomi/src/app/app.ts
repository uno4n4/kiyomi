import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { Popup } from '../app/components/popup/popup';
import { Footer } from './components/footer/footer';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, Footer, Popup],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], 
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('kiyomi');
  user: any = null;

  accueil = false;
  fondblanc = false;
  nav = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // récupération du user côté navigateur sinon erreur SSR
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }

    // À chaque changement de route on met à jour le fond et les styles
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // couleur du fond
        this.updateFondBlanc();

        // Mise à jour des styles spécifiques (accueil, rgpd, etc.)
        this.imageAccueil();
      });
  }

  ngAfterViewInit(): void { //on veille à bien appliquer les styles après le chargement de la vue
    if (!isPlatformBrowser(this.platformId)) return;
    // requestAnimationFrame garantit que le DOM est prêt
    requestAnimationFrame(() => {
      this.updateFondBlanc();
      this.imageAccueil();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const heroHeight = document.querySelector('.hero-header')?.clientHeight || 0;

    this.nav = window.scrollY > heroHeight - 80;
  }

  private updateFondBlanc(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // route actuelle
    let currentRoute = this.router.routerState.root;

    // firstChild = descendre dans l'arborescence des routes
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // recuperaton de la data fondblanc
    this.fondblanc = currentRoute.snapshot.data['fondblanc'] ?? false;

    // Applique la couleur de fond
    this.renderer.setStyle(
      document.body,
      'background-color',
      this.fondblanc ? 'white' : 'black'
    );
    console.log('fond component blanc =', this.fondblanc);
  }

  private imageAccueil(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const current = this.router.url;

    // Image chef accueil
    // trouver un moyen pour afficher l'image quand le component accueil est chargé:
    // window.location.href === 'http://localhost:4200' || window.location.href === 'http://localhost:4200/'
    if (current.includes('/app-accueil') || current.includes('/app-rgpd')) {
      this.accueil = true;
    } else {
      this.accueil = false;
    }
  }

  //REDIRECTION VERS LA "PAGE MENU"
  renvoiMenu(): void {
    this.router.navigate(['/app-menu']); //renvoie au component menu
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.user = null;
  }
}
