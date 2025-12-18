import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxesService } from '../../services/boxes.service';



@Component({
  selector: 'app-filtres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtres.html',
  styleUrls: ['./filtres.css']
})
export class FiltresComponent implements OnInit {

  boxes: any[] = [];

  filters = {
    foods: null,
    flavors: null,
    price_lt: null,
    price_gt: null
  };

  constructor(private boxesService: BoxesService) {}

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.boxesService.getBoxes(this.filters).subscribe((data: any[]) => {
      this.boxes = data;
    });
  }
}
