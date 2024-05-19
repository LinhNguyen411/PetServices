import { Component, OnInit, inject } from '@angular/core';
import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';
import { AddEditSpeciesComponent } from '../add-edit-species/add-edit-species.component';

@Component({
  selector: 'app-show-species',
  standalone: true,
  imports: [AddEditSpeciesComponent],
  templateUrl: './show-species.component.html',
  styleUrl: './show-species.component.css',
})
export class ShowSpeciesComponent implements OnInit {
  private speciesService = inject(SpeciesService);

  species?: Species[];
  ModalTitle?: string;
  spe: Species = {
    id: '',
    name: '',
  };

  constructor() {}
  ngOnInit(): void {
    this.refresh();
  }
  refresh(): void {
    this.speciesService.getAll().subscribe({
      next: (data) => {
        this.species = data;
      },
      error: (e) => console.log(e),
    });
  }

  addClick(): void {
    this.spe = {
      id: '',
      name: '',
    };
    this.ModalTitle = 'Add Species';
  }

  editClick(item: Species): void {
    this.spe = {
      id: item.id,
      name: item.name,
    };
    this.ModalTitle = 'Edit Species';
  }

  deleteClick(item: Species): void {
    if (confirm('Are you sure??') && item.id) {
      this.speciesService.delete(item.id).subscribe({
        next: (res) => {
          this.refresh();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  onSubmitted(submitted: boolean) {
    if (submitted) {
      this.refresh();
    }
  }
}
