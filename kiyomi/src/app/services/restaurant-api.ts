import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type FeaturedBox = {
  id: string;
  name: string;
  pieces: number;
  priceEUR: number;
  imageUrl: string;
};

export type RestaurantStats = {
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

@Injectable({
  providedIn: 'root',
})
export class RestaurantApi {
  constructor(private http: HttpClient) {}

  getFeaturedBoxes(): Observable<FeaturedBox[]> {
    return this.http.get<FeaturedBox[]>('/api/boxes/featured');
  }

  getRestaurantStats(): Observable<RestaurantStats> {
    return this.http.get<RestaurantStats>('/api/stats/restaurant');
  }
}
