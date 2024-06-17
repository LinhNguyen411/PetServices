import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { Room } from '../../../../models/room.model';
import { RoomService } from '../../../../services/room.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

@Component({
  selector: 'app-add-edit-room',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-room.component.html',
  styleUrl: './add-edit-room.component.css',
})
export class AddEditRoomComponent {
  private dataService = inject(RoomService);
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;

  @Output() isSubmitted = new EventEmitter<boolean>();

  @Input() set data(value: Room) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      is_booked: value.is_booked,
      price: [value.price, [Validators.required, Validators.min(1000)]],
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
        this.spinner.hide();
        this.toast.addFail();
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.dataService.update(this.dataForm.get('id')!.value, data).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.spinner.hide();
          this.toast.updateSuccess();
        },
        error: (err) => {
          this.spinner.hide();
          this.toast.updateFail();
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
        is_booked: this.dataForm.get('is_booked')!.value,
        price: this.dataForm.get('price')!.value,
      };
      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
}
