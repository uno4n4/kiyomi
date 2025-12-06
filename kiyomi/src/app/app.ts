import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('kiyomi');
  user: any = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object){}
  ngOnInit(){
    if(isPlatformBrowser(this.platformId)){
    const savedUser = localStorage.getItem('user');
    if(savedUser){
      this.user = JSON.parse(savedUser);
    }
  }
}
}