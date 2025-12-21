import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Input } from '@angular/core';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-fild-ariane',
  imports: [CommonModule],
  templateUrl: './fild-ariane.html',
  styleUrl: './fild-ariane.css',
})
export class FildAriane {
  constructor(private router: Router, private route: ActivatedRoute) {}
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
    'app-rgpd'
  ];
  @Input() horizontal: boolean = false;
  accueil: boolean = false;

  //pour détecter la page actuelle si c'est l'accueil on pourra mettre le menu en gras
  ngOnInit() {
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
