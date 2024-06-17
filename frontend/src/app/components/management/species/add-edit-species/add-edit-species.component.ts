import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

@Component({
  selector: 'app-add-edit-species',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-species.component.html',
  styleUrl: './add-edit-species.component.css',
})
export class AddEditSpeciesComponent {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private SpeciesService = inject(SpeciesService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;

  @Output() isSubmitted = new EventEmitter<boolean>();

  @Input() set spe(value: Species) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
    });
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
  }

  constructor() {}
  add(data: any): void {
    this.SpeciesService.create(data).subscribe({
      next: (res) => {
        this.isSubmitted.emit(true);
        this.toast.addSuccess();
        this.spinner.hide();
      },
      error: (err) => {
        this.toast.addFail();
        this.spinner.hide();
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.SpeciesService.update(
        this.dataForm.get('id')!.value,
        data
      ).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.toast.updateSuccess();
          this.spinner.hide();
        },
        error: (err) => {
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
      var data = {
        name: this.dataForm.get('name')!.value,
      };
      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
}
