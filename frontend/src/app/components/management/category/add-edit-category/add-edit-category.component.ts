import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { CategoryService } from '../../../../services/category.service';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-category.component.html',
  styleUrl: './add-edit-category.component.css',
})
export class AddEditCategoryComponent {
  private dataService = inject(CategoryService);
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;
  componentName = 'Category';

  @Output() isSubmitted = new EventEmitter<boolean>();

  @Input() set data(value: any) {
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
    this.dataService.create(data).subscribe({
      next: (res) => {
        this.isSubmitted.emit(true);

        this.toast.addSuccess();
      },
      error: (err) => {
        this.toast.addFail();
      },
      complete: () => {
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
        },
        error: (err) => {
          this.toast.updateFail();
        },
        complete: () => {
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
