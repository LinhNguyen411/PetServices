import { Component } from '@angular/core';
import { ShowPetComponent } from './show-pet/show-pet.component';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [ShowPetComponent],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css',
})
export class PetComponent {}
