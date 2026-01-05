import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RestaurantApi, RestaurantStats } from '../../services/restaurant-api';
import { Chart, registerables } from 'chart.js';
import { Suggestion } from '../suggestion/suggestion';
import { FildAriane } from '../fild-ariane/fild-ariane';

Chart.register(...registerables);

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, Suggestion, FildAriane],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css',
})
export class RestaurantComponent implements OnInit, AfterViewInit {
  stats: RestaurantStats = {
    usersStatus: [],
    chiffreAffaire: [],
    panierMoy: [],
  };

  private revenueChart?: Chart;
  private avgBasketChart?: Chart;

  constructor(private api: RestaurantApi, @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.api.getRestaurantStats().subscribe((data) => {
      this.stats = data;
      requestAnimationFrame(() => this.renderCharts());
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => this.renderCharts());
  }

  private renderCharts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const revenueCanvas = document.getElementById('caStat') as HTMLCanvasElement | null;

    const avgBasketCanvas = document.getElementById('panierMoyStats') as HTMLCanvasElement | null;

    this.revenueChart?.destroy();
    this.avgBasketChart?.destroy();

    // Chiffre d’affaire par mois
    if (revenueCanvas && this.stats.chiffreAffaire.length) {
      this.revenueChart = new Chart(revenueCanvas, {
        type: 'bar',
        data: {
          labels: this.stats.chiffreAffaire.map((x) => x.label),
          datasets: [
            {
              data: this.stats.chiffreAffaire.map((x) => x.value),
              backgroundColor: '#5b0b0b',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
        },
      });
    }

    //Panier moyen par statut
    if (avgBasketCanvas && this.stats.panierMoy.length) {
      this.avgBasketChart = new Chart(avgBasketCanvas, {
        type: 'bar',
        data: {
          labels: this.stats.panierMoy.map((x) => x.label),
          datasets: [
            {
              data: this.stats.panierMoy.map((x) => x.value),
              backgroundColor: '#3b0a0a',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
        },
      });
    }
  }
}
