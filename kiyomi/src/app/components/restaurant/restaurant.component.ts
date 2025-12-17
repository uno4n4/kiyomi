import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type FeaturedBox = {
  id: string;
  name: string;
  pieces: number;
  priceEUR: number;
  imageUrl: string;
};

type RestaurantStats = {
  percentages: {
    takeaway: number;
    delivery: number;
    onSite: number;
  };
  charts: {
    weeklyOrders: { label: string; value: number }[];
    satisfaction: { label: string; value: number }[];
  };
};

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css',
})
export class RestaurantComponent {
  // ✅ MOCKS (on branchera l’API après)
  featuredBoxes: FeaturedBox[] = [
    {
      id: 'amateur-mix',
      name: 'AMATEUR MIX',
      pieces: 18,
      priceEUR: 10.9,
      imageUrl: 'assets/images/boxes/amateur-mix.jpg',
    },
    {
      id: 'fresh-mix',
      name: 'FRESH MIX',
      pieces: 22,
      priceEUR: 24.5,
      imageUrl: 'assets/images/boxes/fresh-mix.jpg',
    },
    {
      id: 'gourmet-mix',
      name: 'GOURMET MIX',
      pieces: 22,
      priceEUR: 24.5,
      imageUrl: 'assets/images/boxes/gourmet-mix.jpg',
    },
  ];

  stats: RestaurantStats = {
    percentages: { takeaway: 28, delivery: 57, onSite: 15 },
    charts: {
      weeklyOrders: [
        { label: 'Lun', value: 12 },
        { label: 'Mar', value: 28 },
        { label: 'Mer', value: 22 },
        { label: 'Jeu', value: 31 },
        { label: 'Ven', value: 26 },
        { label: 'Sam', value: 38 },
        { label: 'Dim', value: 20 },
      ],
      satisfaction: [
        { label: 'Service', value: 78 },
        { label: 'Qualité', value: 85 },
        { label: 'Rapport Q/P', value: 72 },
        { label: 'Livraison', value: 66 },
      ],
    },
  };
}
