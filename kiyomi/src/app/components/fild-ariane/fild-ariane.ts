import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fild-ariane',
  imports: [CommonModule],
  templateUrl: './fild-ariane.html',
  styleUrl: './fild-ariane.css',
})
export class FildAriane {
  constructor(
    private router: Router
  ) {}
  navigateTo(path: string) {
    window.location.href = path;
  }
  //REDIRECTION VERS LA "PAGE MENU"
  public renvoi(chemin: string) {
    this.router.navigate([chemin]); //renvoie au component visé
  }
}
