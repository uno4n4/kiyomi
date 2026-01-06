import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-fild-ariane',
  imports: [CommonModule],
  templateUrl: './fild-ariane.html',
  styleUrl: './fild-ariane.css',
})
export class FildAriane {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private route: ActivatedRoute) {}
  navigateTo(path: string) {
    window.location.href = path;
  }
  pageHorizontales: string[] = [
    '/app-produit',
    '/app-panier',
    '/app-formulaire-inscription',
    '/app-compte-user',
    '/app-forgot-password',
    '/app-formulaire-co',
    '/app-restaurant',
    'app-rgpd',
  ];
  @Input() horizontal: boolean = false;
  accueil: boolean = false;
  user: any = null;

  //pour détecter la page actuelle si c'est l'accueil on pourra mettre le menu en gras
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route.firstChild;

      while (currentRoute?.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.accueil = currentRoute?.snapshot.data['accueil'] ?? false;

      console.log('AppComponent accueil present pour le fil ariane =', this.accueil);
    });
  }

  isAccueil(): boolean {
    return this.accueil;
  }

  //PAGE ACTUELLE EN GRAS
  isCurrentPage(path: string): boolean {
    return this.router.url.includes(path);
  }

  //REDIRECTION VERS LA "PAGE" VISÉE
  public renvoi(chemin: string) {
    this.router.navigate([chemin]); //renvoie au component visé
  }
}
