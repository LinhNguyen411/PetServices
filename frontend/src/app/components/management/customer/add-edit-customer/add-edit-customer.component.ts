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

import { Customer } from '../../../../models/customer.model';
import { CustomerService } from '../../../../services/customer.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';
@Component({
  selector: 'app-add-edit-customer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-customer.component.html',
  styleUrl: './add-edit-customer.component.css',
})
export class AddEditCustomerComponent {
  private spinner = inject(NgxSpinnerService);
  private dataService = inject(CustomerService);
  private authService = inject(AuthService);
  userService = inject(UserService);
  toast = inject(ToastServiceService);
  formBuilder = inject(FormBuilder);
  subDataForm!: FormGroup;
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;

  message?: string;
  user?: any;
  url?: any;
  @ViewChild('fileInput') fileInput: any;

  @Output() isSubmitted = new EventEmitter<boolean>();
  @Output() customer = new EventEmitter<any>();

  isCustomer: boolean = false;
  @Input() set isCus(value: boolean) {
    if (value) {
      this.isCustomer = value;
      this.userService.user$.subscribe((res) => {
        if (res) {
          this.user = res;
          this.subDataForm = this.formBuilder.group({
            username: [res.name, Validators.required],
            email: res.email,
          });
          this.url = res.photo ? res.photo : '../assets/no-img.jpg';
        }
      });
    }
  }
  @Input() set data(value: Customer) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      address: [value.address, Validators.required],
      phone_number: [value.phone_number, Validators.required],
      account: value.account,
    });
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
  }

  constructor() {}
  add(data: any): void {
    this.dataService.create(data).subscribe({
      next: (res) => {
        this.customer.emit(res);
        this.isSubmitted.emit(true);

        this.spinner.hide();
        this.toast.addSuccess();
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

          this.toast.updateSuccess;
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
    if (this.isCustomer) {
      if (this.dataForm.valid && this.subDataForm.valid) {
        this.spinner.show();
        var data = {
          name: this.dataForm.get('name')!.value,
          address: this.dataForm.get('address')!.value,
          phone_number: this.dataForm.get('phone_number')!.value,
        };
        var subData = new FormData();
        subData.append('name', this.subDataForm.get('username')!.value);
        if (this.fileInput.nativeElement.files[0]) {
          subData.append('photo', this.fileInput.nativeElement.files[0]);
        }
        this.dataService
          .update(this.dataForm.get('id')?.value, data)
          .subscribe({
            next: (res) => {
              this.dataService
                .updateAccount(this.dataForm.get('id')?.value, subData)
                .subscribe((res) => {
                  console.log(res);
                  this.authService.getCurrentAuthUser().subscribe();
                  this.toast.updateSuccess();
                  this.spinner.hide();
                });
            },
            error: (err) => {
              console.log(err);
              this.toast.updateFail();
              this.spinner.hide();
            },
          });
      }
    } else {
      if (this.dataForm.valid) {
        this.spinner.show();

        var data = {
          name: this.dataForm.get('name')!.value,
          address: this.dataForm.get('address')!.value,
          phone_number: this.dataForm.get('phone_number')!.value,
        };
        if (this.isUpdate) {
          this.update(data);
        } else {
          this.add(data);
        }
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

  changePassword(): void {
    this.spinner.show();
    this.authService.reset_password(this.user.email).subscribe((res) => {
      this.message = 'Hãy kiểm tra email để thay đổi mật khẩu';
      this.spinner.hide();
    });
  }
}
