import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
//recupere le terme de recherche saisi dans la barre de recherche
export class SearchTerm {
  private searchSubject = new BehaviorSubject<string>('');//valeur initiale vide
  search$ = this.searchSubject.asObservable();

  setSearch(value: string): void {
    this.searchSubject.next(value);//met à jour la valeur du terme de recherche
  }
}
