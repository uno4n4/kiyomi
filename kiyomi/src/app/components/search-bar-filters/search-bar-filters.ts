import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchTerm } from '../../services/search-term';

@Component({
  selector: 'app-search-bar-filters',
  imports: [FormsModule],
  templateUrl: './search-bar-filters.html',
  styleUrl: './search-bar-filters.css',
})
export class SearchBarFilters {
  //communique la rcherche au composant d'affichage via le service search
  constructor(private searchTerm: SearchTerm){}
  term = '';
  search(): void {
    this.searchTerm.setSearch(this.term);
  }
}
