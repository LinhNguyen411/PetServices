import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { Species } from '../../../../models/species.model';
import { FormsModule } from '@angular/forms';
import { SpeciesService } from '../../../../services/species.service';

@Component({
  selector: 'app-add-edit-species',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-edit-species.component.html',
  styleUrl: './add-edit-species.component.css',
})
export class AddEditSpeciesComponent implements OnInit {
  species: Species = {
    id: '',
    name: '',
  };
  @Input() set spe(value: Species) {
    this.species = value;
  }
  @Output() submitted = new EventEmitter<boolean>();
  private speciesService = inject(SpeciesService);

  constructor() {}
  ngOnInit(): void {
    this.submitted.emit(false);
  }
  addSpecies(): void {
    var data = { name: this.species.name };
    this.speciesService.create(data).subscribe({
      next: (res) => {
        this.submitted.emit(true);
        console.log(res);
      },
      error: (err) => {
        this.submitted.emit(true);
        console.log(err);
      },
    });
  }
  updateSpecies(): void {
    var data = { name: this.species.name };
    if (this.species.id) {
      this.speciesService.update(this.species.id, data).subscribe({
        next: (res) => {
          console.log(res);
          this.submitted.emit(true);
        },
        error: (err) => {
          this.submitted.emit(true);
          console.log(err);
        },
      });
    }
  }
}
