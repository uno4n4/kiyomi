import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Accueil } from './components/accueil/accueil';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Accueil],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('kiyomi');
}
