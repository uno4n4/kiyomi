import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type FeaturedBox = {
  id: string;
  name: string;
  pieces: number;
  prix: number;
  imageUrl: string;
};

export type StatItem = {
  label: string;
  value: number;
};

export type RestaurantStats = {
  usersStatus: StatItem[];
  chiffreAffaire: StatItem[];
  panierMoy: StatItem[];
};

@Injectable({
  providedIn: 'root',
})
export class RestaurantApi {
  private API_URL = 'http://localhost/kiyomi/kiyomi/sushi_box/api/restaurant.php';

  constructor(private http: HttpClient) {}

  getRestaurantStats(): Observable<RestaurantStats> {
    return this.http.get<RestaurantStats>(this.API_URL);
  }
}

