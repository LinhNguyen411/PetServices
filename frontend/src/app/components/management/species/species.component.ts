import { Component } from '@angular/core';
import { ShowSpeciesComponent } from './show-species/show-species.component';

@Component({
  selector: 'app-species',
  standalone: true,
  imports: [ShowSpeciesComponent],
  templateUrl: './species.component.html',
  styleUrl: './species.component.css',
})
export class SpeciesComponent {}
