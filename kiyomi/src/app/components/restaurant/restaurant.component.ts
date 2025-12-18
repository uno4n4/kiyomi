import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RestaurantApi, FeaturedBox, RestaurantStats } from '../../services/restaurant-api';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule],
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

  ngOnInit(): void {
    // ✅ BLOQUE tout côté serveur (prerender/SSR)
    if (!isPlatformBrowser(this.platformId)) return;

    this.api.getFeaturedBoxes().subscribe({
      next: (data) => (this.featuredBoxes = data),
      error: (err) => console.error('Erreur boxes featured', err),
    });

    this.api.getRestaurantStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.renderCharts(); // ✅ seulement browser
      },
      error: (err) => console.error('Erreur stats restaurant', err),
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.renderCharts();
  }

  private renderCharts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const weeklyCanvas = document.getElementById('weeklyChart') as HTMLCanvasElement | null;
    const satisfactionCanvas = document.getElementById('satisfactionChart') as HTMLCanvasElement | null;
    if (!weeklyCanvas || !satisfactionCanvas) return;

    if (!this.stats.charts.weeklyOrders.length || !this.stats.charts.satisfaction.length) return;
    if (!isPlatformBrowser(this.platformId)) return;


    this.weeklyChart?.destroy();
    this.satisfactionChart?.destroy();

    this.weeklyChart = new Chart(weeklyCanvas, {
      type: 'bar',
      data: {
        labels: this.stats.charts.weeklyOrders.map((x) => x.label),
        datasets: [{ data: this.stats.charts.weeklyOrders.map((x) => x.value) }],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });

    this.satisfactionChart = new Chart(satisfactionCanvas, {
      type: 'bar',
      data: {
        labels: this.stats.charts.satisfaction.map((x) => x.label),
        datasets: [{ data: this.stats.charts.satisfaction.map((x) => x.value) }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { suggestedMax: 100 } },
      },
    });
  }
}
