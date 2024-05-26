import { Component } from '@angular/core';
import { ShowWeightComponent } from './show-weight/show-weight.component';

@Component({
  selector: 'app-weight',
  standalone: true,
  imports: [ShowWeightComponent],
  templateUrl: './weight.component.html',
  styleUrl: './weight.component.css',
})
export class WeightComponent {}
