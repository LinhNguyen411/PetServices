import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VietnamCurrencyPipe } from '../../../../pipes/vietnam-currency.pipe';
import { NgxPrintModule } from 'ngx-print';

import { ServiceBill } from '../../../../models/service-bill.model';
import { ServiceBillService } from '../../../../services/service-bill.service';

import { Surcharges } from '../../../../models/surcharges.model';
import { SurchargeService } from '../../../../services/surcharge.service';

import { ServiceBooking } from '../../../../models/service-booking.model';
import { ServiceBookingService } from '../../../../services/service-booking.service';

import { SubServiceBooking } from '../../../../models/sub-service-booking.model';
import { SubServiceBookingService } from '../../../../services/sub-service-booking.service';

import { Employee } from '../../../../models/employee.model';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
  selector: 'app-detail-service-bill',
  standalone: true,
  imports: [CommonModule, VietnamCurrencyPipe, NgxPrintModule],
  templateUrl: './detail-service-bill.component.html',
  styleUrl: './detail-service-bill.component.css',
})
export class DetailServiceBillComponent {
  dataService = inject(ServiceBillService);
  employeeService = inject(EmployeeService);
  surchargeService = inject(SurchargeService);
  bookingService = inject(ServiceBookingService);
  subBookingService = inject(SubServiceBookingService);

  bill?: ServiceBill;
  surcharges?: Surcharges[];
  employee?: Employee;
  booking?: ServiceBooking;
  subBookings?: SubServiceBooking[];

  @Input() set data(value: ServiceBill) {
    this.bill = value;
    if (value) {
      this.surchargeService
        .getAll({ bill_value: value.id })
        .subscribe((res) => {
          this.surcharges = res.results;
        });
      this.employeeService.get(value.employee).subscribe((res) => {
        this.employee = res;
      });
      this.bookingService.get(value.booking).subscribe((res) => {
        this.booking = res;
      });
      this.subBookingService
        .getAll({ booking_value: value.booking })
        .subscribe((res) => {
          this.subBookings = res.results;
        });
    }
  }
}
