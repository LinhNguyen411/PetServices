import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { Weight } from '../../../../models/weight.model';
import { WeightService } from '../../../../services/weight.service';
import { Species } from '../../../../models/species.model';

@Component({
  selector: 'app-add-edit-weight',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-weight.component.html',
  styleUrl: './add-edit-weight.component.css',
})
export class AddEditWeightComponent {
  private dataService = inject(WeightService);
  toast = inject(NgToastService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;

  @Output() isSubmitted = new EventEmitter<boolean>();
  @Input() speciesList?: Species[];

  @Input() set data(value: Weight) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      species: [value.species, Validators.required],
      weight_range: [value.weight_range, Validators.required],
      weight_type: [value.weight_type, Validators.required],
    });
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
  }

  constructor() {}
  add(data: any): void {
    this.dataService.create(data).subscribe({
      next: (res) => {
        this.isSubmitted.emit(true);

        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Add Item Successfully',
          duration: 2000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'FAILED',
          summary: 'Failed To Add',
          duration: 2000,
        });
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.dataService.update(this.dataForm.get('id')!.value, data).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Update Item Successfully',
            duration: 2000,
          });
        },
        error: (err) => {
          this.toast.error({
            detail: 'FAILED',
            summary: 'Failed To Update',
            duration: 2000,
          });
        },
      });
    }
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.dataForm.valid) {
      var data = {
        species: this.dataForm.get('species')!.value,
        weight_range: this.dataForm.get('weight_range')!.value,
        weight_type: this.dataForm.get('weight_type')!.value,
      };
      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
}
