import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RestaurantApi, FeaturedBox, RestaurantStats } from '../../services/restaurant-api';
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
  featuredBoxes: FeaturedBox[] = [];

  stats: RestaurantStats = {
    percentages: { takeaway: 0, delivery: 0, onSite: 0 },
    charts: { weeklyOrders: [], satisfaction: [], ordersByCity: [] },
  };

  private weeklyChart?: Chart;
  private cityChart?: Chart;

  constructor(
    private api: RestaurantApi,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.api.getFeaturedBoxes().subscribe({
      next: (data) => (this.featuredBoxes = data),
      error: (err) => console.error('Erreur boxes featured', err),
    });

    this.api.getRestaurantStats().subscribe({
      next: (data) => {
        this.stats = data;
        requestAnimationFrame(() => this.renderCharts());
      },
      error: (err) => console.error('Erreur stats restaurant', err),
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => this.renderCharts());
  }

  private renderCharts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const weeklyCanvas = document.getElementById('weeklyChart') as HTMLCanvasElement | null;
    const cityCanvas = document.getElementById('cityChart') as HTMLCanvasElement | null;

    if (!weeklyCanvas) return;

    this.weeklyChart?.destroy();
    this.cityChart?.destroy();

    // ✅ Weekly chart
    if (this.stats.charts.weeklyOrders?.length) {
      this.weeklyChart = new Chart(weeklyCanvas, {
        type: 'bar',
        data: {
          labels: this.stats.charts.weeklyOrders.map((x) => x.label),
          datasets: [
            {
              data: this.stats.charts.weeklyOrders.map((x) => x.value),
              backgroundColor: '#5b0b0b',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#666' } },
            y: { grid: { color: '#eaeaea' }, ticks: { color: '#666' } },
          },
        },
      });
    }

    // ✅ City chart (Commandes par villes)
    if (cityCanvas && this.stats.charts.ordersByCity?.length) {
      this.cityChart = new Chart(cityCanvas, {
        type: 'bar',
        data: {
          labels: this.stats.charts.ordersByCity.map((x) => x.label),
          datasets: [
            {
              data: this.stats.charts.ordersByCity.map((x) => x.value),
              backgroundColor: '#3b0a0a',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#666' } },
            y: { grid: { color: '#eaeaea' }, ticks: { color: '#666' } },
          },
        },
      });
    }
  }
}
