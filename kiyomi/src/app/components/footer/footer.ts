import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  constructor(private router: Router){}

  rgpd(){
    this.router.navigate(['/app-rgpd']);
  }
  //REDIRECTION VERS LA "PAGE" VISÉE
  public renvoi(chemin: string) {
    this.router.navigate([chemin]); //renvoie au component visé
  }
}
