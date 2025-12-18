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

  getRestaurantStats(): Observable<RestaurantStats> {
  return this.http.get<RestaurantStats>(
    'http://localhost/kiyomi/kiyomi/sushi_box/api/restaurant.php'
  );
}

getFeaturedBoxes(): Observable<FeaturedBox[]> {
  return this.http.get<FeaturedBox[]>(
    'http://localhost/kiyomi/kiyomi/sushi_box/api/boxes/'
  );
}


}
