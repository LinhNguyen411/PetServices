import {
  Component,
  inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { ServiceBillService } from '../../../../services/service-bill.service';
import { ServiceBooking } from '../../../../models/service-booking.model';

import { UserService } from '../../../../services/user.service';
import { Surcharges } from '../../../../models/surcharges.model';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-service-bill',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-service-bill.component.html',
  styleUrl: './add-service-bill.component.css',
})
export class AddServiceBillComponent implements OnInit {
  userData?: any;
  private billService = inject(ServiceBillService);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);

  private toast = inject(ToastServiceService);
  private spinner = inject(NgxSpinnerService);

  subSubmitted?: boolean;

  surcharges?: Surcharges[];
  dataForm: FormGroup = this.formBuilder.group({
    employee: '',
    customer: '',
    payment_method: 'off',
    booking: '',
  });
  subDataForm: FormGroup = this.formBuilder.group({
    reasons: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1000)]],
  });

  @Output() isSubmitted = new EventEmitter<boolean>();
  @Input() set data(value: ServiceBooking) {
    this.dataForm.controls.customer.setValue(value.customer.id);
    this.dataForm.controls.booking.setValue(value.id);
    this.userService.userData$.subscribe((userData) => {
      if (userData) {
        this.dataForm.patchValue({
          employee: userData.id,
        });
      }
    });
    this.surcharges = [];
    this.isSubmitted.emit(false);
  }
  constructor() {}
  ngOnInit(): void {
    this.isSubmitted.emit(false);

    this.subSubmitted = false;
  }
  addItem() {
    this.subSubmitted = true;
    if (this.subDataForm.valid) {
      var new_item: Surcharges = {
        id: '',
        bill: '',
        reasons: this.subDataForm.get('reasons')?.value,
        price: this.subDataForm.get('price')?.value,
      };
      this.subSubmitted = false;
      this.subDataForm.controls.reasons.setValue('');
      this.subDataForm.controls.price.setValue(0);
      this.surcharges?.push(new_item);
    }
  }
  deleteClick(item: any) {
    this.surcharges = this.surcharges?.filter((obj) => {
      return obj !== item;
    });
  }
  onSubmit(): void {
    if (this.dataForm.valid && this.surcharges) {
      this.spinner.show();
      var data = {
        employee: this.dataForm.get('employee')?.value,
        booking: this.dataForm.get('booking')?.value,
        payment_method: this.dataForm.get('payment_method')?.value,
      };
      this.billService.create(data, this.surcharges).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);
          this.toast.success('Tạo hóa đơn dịch vụ thành công!');
          this.spinner.hide();
        },
        error: (e) => {
          this.toast.fail('Tạo hóa đơn dịch vụ thất bại!');
          this.spinner.hide();
        },
      });
    }
  }
}
