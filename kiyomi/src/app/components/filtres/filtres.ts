import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtres',
  imports: [CommonModule],
  templateUrl: './filtres.html',
  styleUrl: './filtres.css',
})
export class Filtres {
  API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/boxes';


}
