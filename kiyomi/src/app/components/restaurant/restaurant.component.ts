import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  RestaurantApi,
  FeaturedBox,
  RestaurantStats
} from '../../services/restaurant-api';
import { Chart, registerables } from 'chart.js';
import { Suggestion } from '../suggestion/suggestion';




Chart.register(...registerables);

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, Suggestion],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css',
})

export class RestaurantComponent implements OnInit, AfterViewInit {
  featuredBoxes: FeaturedBox[] = [];

  stats: RestaurantStats = {
    percentages: { takeaway: 0, delivery: 0, onSite: 0 },
    charts: { weeklyOrders: [], satisfaction: [] },
  };

  private weeklyChart?: Chart;
  private satisfactionChart?: Chart;

  constructor(
    private api: RestaurantApi,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /* =========================
     INIT
  ========================== */
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

  /* =========================
     CHARTS
  ========================== */
  private renderCharts(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.stats.charts.weeklyOrders.length || !this.stats.charts.satisfaction.length) return;

    const weeklyCanvas = document.getElementById('weeklyChart') as HTMLCanvasElement | null;
    const satisfactionCanvas = document.getElementById('satisfactionChart') as HTMLCanvasElement | null;
    if (!weeklyCanvas || !satisfactionCanvas) return;

    this.weeklyChart?.destroy();
    this.satisfactionChart?.destroy();

    /* Weekly orders */
    this.weeklyChart = new Chart(weeklyCanvas, {
      type: 'bar',
      data: {
        labels: this.stats.charts.weeklyOrders.map(x => x.label),
        datasets: [{
          data: this.stats.charts.weeklyOrders.map(x => x.value),
          backgroundColor: '#5b0b0b',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#bbb' } },
          y: { grid: { color: '#222' }, ticks: { color: '#bbb' } }
        }
      }
    });

    /* Satisfaction */
    this.satisfactionChart = new Chart(satisfactionCanvas, {
      type: 'bar',
      data: {
        labels: this.stats.charts.satisfaction.map(x => x.label),
        datasets: [{
          data: this.stats.charts.satisfaction.map(x => x.value),
          backgroundColor: '#2b0000',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#bbb' } },
          y: {
            suggestedMax: 100,
            grid: { color: '#222' },
            ticks: { color: '#bbb' }
          }
        }
      }
    });
  }
}
