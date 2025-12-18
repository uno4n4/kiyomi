import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filtres.html',
  styleUrl: './filtres.css',
})
export class Filtres {
  @Output() filterChanged = new EventEmitter<any>();

  currentFilters = { prix: '', portion: '', saveurs: '' };

  onFilterChange(type: string, event: any) {
    const value = event.target.value;
    if (type === 'prix') this.currentFilters.prix = value;
    if (type === 'portion') this.currentFilters.portion = value;
    if (type === 'saveurs') this.currentFilters.saveurs = value;

    // On émet les filtres vers BoxesEnsemble
    this.filterChanged.emit(this.currentFilters);
  }
}