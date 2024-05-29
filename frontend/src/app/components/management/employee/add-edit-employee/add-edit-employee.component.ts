import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { Employee } from '../../../../models/employee.model';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.css',
})
export class AddEditEmployeeComponent {
  private dataService = inject(EmployeeService);
  toast = inject(NgToastService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;
  url?: string;
  new_pass?: string;

  @ViewChild('fileInput') fileInput: any;

  customer?: any;

  @Output() isSubmitted = new EventEmitter<boolean>();

  @Input() set data(value: Employee) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      role: [value.role, Validators.required],
      date_of_joining: value.date_of_joining,
      phone_number: [value.phone_number, Validators.required],
      address: [value.address, Validators.required],
      status: [value.status, Validators.required],
      photo: value.photo,
      account: value.account,
    });
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
    this.url = value.photo ? value.photo : '../assets/no-img.jpg';
    console.log(value.photo);
    this.new_pass = '';
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
          console.log(err);
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
    console.log(this.dataForm.invalid);
    if (this.dataForm.valid) {
      var data = new FormData();
      data.append('name', this.dataForm.get('name')!.value);
      data.append('role', this.dataForm.get('role')!.value);
      data.append(
        'date_of_joining',
        this.dataForm.get('date_of_joining')!.value
      );
      data.append('phone_number', this.dataForm.get('phone_number')!.value);
      data.append('address', this.dataForm.get('address')!.value);
      data.append('status', this.dataForm.get('status')!.value);
      if (this.fileInput.nativeElement.files[0]) {
        console.log('have file');
        data.append('photo', this.fileInput.nativeElement.files[0]);
      }

      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
  onSelectFile(e: any): void {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }
  account(action: string): void {
    if (action == 'account') {
      this.dataService
        .account(this.dataForm.get('id')?.value, 'create_account')
        .subscribe({
          next: (res) => {
            this.isSubmitted.emit(true);

            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Account Created Successfully',
              duration: 2000,
            });
          },
          error: (err) => {
            console.log(err);
            this.toast.error({
              detail: 'FAILED',
              summary: 'Failed To Create Account',
              duration: 2000,
            });
          },
        });
    } else if (action == 'password') {
      this.dataService
        .account(this.dataForm.get('id')?.value, 'generate_password')
        .subscribe({
          next: (res) => {
            this.new_pass = res.new_pass;
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'New Password Generated Successfully',
              duration: 2000,
            });
          },
          error: (err) => {
            console.log(err);
            this.toast.error({
              detail: 'FAILED',
              summary: 'Failed To Generate New Password',
              duration: 2000,
            });
          },
        });
    }
  }
}
