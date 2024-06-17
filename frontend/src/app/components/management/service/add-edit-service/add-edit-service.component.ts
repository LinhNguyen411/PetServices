import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

import { Service } from '../../../../models/service.model';
import { ServiceService } from '../../../../services/service.service';

import { Species } from '../../../../models/species.model';
@Component({
  selector: 'app-add-edit-service',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-service.component.html',
  styleUrl: './add-edit-service.component.css',
})
export class AddEditServiceComponent {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private dataService = inject(ServiceService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;

  customer?: any;

  @Output() isSubmitted = new EventEmitter<boolean>();
  @Input() speciesList?: Species[];

  @Input() set data(value: Service) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      description: [value.description, Validators.required],
      species: [value.species, Validators.required],
      price: [value.price, [Validators.required, Validators.min(1000)]],
      is_one_day: value.is_one_day,
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

        this.toast.addSuccess();
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.toast.addFail();
        this.spinner.hide();
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.dataService.update(this.dataForm.get('id')!.value, data).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.toast.updateSuccess();
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.toast.updateFail();
          this.spinner.hide();
        },
      });
    }
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.dataForm.valid) {
      this.spinner.show();
      var data = new FormData();
      data.append('name', this.dataForm.get('name')!.value);
      data.append('description', this.dataForm.get('description')!.value);
      data.append('species', this.dataForm.get('species')!.value);
      data.append('price', this.dataForm.get('price')!.value);
      data.append('is_one_day', this.dataForm.get('is_one_day')!.value);

      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
}
