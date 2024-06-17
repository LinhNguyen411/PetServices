import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NgToastService } from 'ng-angular-popup';

import { ServiceBooking } from '../../../../models/service-booking.model';
import { ServiceBookingComponent } from '../service-booking.component';

import { SubServiceBooking } from '../../../../models/sub-service-booking.model';
import { SubServiceBookingService } from '../../../../services/sub-service-booking.service';

import { Customer } from '../../../../models/customer.model';
import { CustomerService } from '../../../../services/customer.service';

import { Pet } from '../../../../models/pet.model';
import { PetService } from '../../../../services/pet.service';
import { ServiceService } from '../../../../services/service.service';
import { Service } from '../../../../models/service.model';
import { ServiceBookingService } from '../../../../services/service-booking.service';
import { Room } from '../../../../models/room.model';
import { RoomService } from '../../../../services/room.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-add-service-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-service-booking.component.html',
  styleUrl: './add-service-booking.component.css',
})
export class AddServiceBookingComponent implements OnInit {
  private observer = inject(BreakpointObserver);
  isMobile: boolean = true;
  statusList: any = [
    { short: 'a', long: 'accepted' },
    {
      short: 'e',
      long: 'cancel',
    },
    {
      short: 'c',
      long: 'completed',
    },
    {
      short: 'p',
      long: 'proceed',
    },
    {
      short: 'u',
      long: 'upaccept',
    },
  ];

  private router = inject(Router);
  private dataService = inject(ServiceBookingService);
  private customerService = inject(CustomerService);
  private serviceService = inject(ServiceService);
  private petService = inject(PetService);
  private roomService = inject(RoomService);

  private toast = inject(NgToastService);
  private formBuilder = inject(FormBuilder);

  submitted?: boolean;

  customer?: Customer;
  petList?: Pet[];
  serviceList?: Service[];
  subServiceList?: Service[];
  roomList?: Room[];

  user?: any;
  userData?: any;
  userService = inject(UserService);

  dataForm: FormGroup = this.formBuilder.group({
    date_booked: '',
    date_start: ['', Validators.required],
    stay_days: [1, [Validators.required, Validators.min(1)]],
    status: ['a', Validators.required],
    note: [''],
    customer: ['', Validators.required],
    pet: ['', Validators.required],
    service: ['', Validators.required],
    room: ['', Validators.required],
    sub_service: '',
  });
  data?: ServiceBooking;
  subBookingList: SubServiceBooking[] = [];

  constructor() {}
  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.dataForm = this.formBuilder.group({
      date_booked: '',
      date_start: ['', Validators.required],
      stay_days: [1, [Validators.required, Validators.min(1)]],
      status: 'a',
      note: '',
      customer: ['', Validators.required],
      pet: ['', Validators.required],
      service: ['', Validators.required],
      room: ['', Validators.required],
      sub_service: '',
    });
    this.subBookingList = [];
    this.roomService.getAll({ is_booked: false }).subscribe((res) => {
      this.roomList = res.results;
    });
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((data) => {
      this.userData = data;
      if (data && this.user.account_type == 'c') {
        this.dataForm.patchValue({
          customer: this.userData.id,
        });
        this.searchCustomer();
        this.dataForm.controls.status.setValue('u');
      }
    });
  }
  searchCustomer() {
    if (this.dataForm?.get('customer')?.value) {
      this.customerService
        .searchByValue(this.dataForm.get('customer')?.value)
        .subscribe((res) => {
          if (res.results[0]) {
            this.customer = res.results[0];
          } else {
            this.customer = undefined;
          }
          if (this.customer) {
            const customer_id = this.customer.id;
            this.dataForm?.controls.customer.setValue(customer_id);
            if (customer_id) this.searchPet(customer_id);
          }
        });
    }
  }

  searchPet(id: string) {
    this.petService.getAll({ owner_value: id }).subscribe((res) => {
      this.petList = res.results;
    });
  }
  onPetChange() {
    if (this.dataForm?.controls.pet.value) {
      this.petService
        .get(this.dataForm?.controls.pet.value)
        .subscribe((res) => {
          const species = res.species.id;
          this.serviceService
            .getAll({ species_value: species, is_one_day: 'true' })
            .subscribe((res) => {
              console.log(res);
              this.serviceList = res.results;
            });
          this.serviceService
            .getAll({ species_value: species, is_one_day: 'false' })
            .subscribe((res) => {
              console.log(res);
              this.subServiceList = res.results;
            });
        });
    } else {
      this.serviceList = [];
      this.subServiceList = [];
    }
    this.dataForm.controls.service.setValue('');
    this.dataForm.controls.sub_service.setValue('');
    this.subBookingList = [];
  }
  onMainServiceChange() {
    const main_service = this.dataForm.get('service')?.value;
    this.subServiceList = this.subServiceList?.filter((obj) => {
      return obj.id != main_service;
    });
    this.dataForm.controls.sub_service.setValue('');
    this.subBookingList = [];
  }

  addSubService() {
    if (this.dataForm.get('sub_service')?.value) {
      const sub_service = this.dataForm.get('sub_service')?.value;
      this.dataForm.controls.sub_service.setValue('');
      this.subServiceList = this.subServiceList?.filter((obj) => {
        return obj !== sub_service;
      });
      const sub_booking = {
        id: '',
        booking: '',
        service: sub_service,
        is_completed: false,
      };
      this.subBookingList.push(sub_booking);
    }
  }
  deleteClick(item: any) {
    this.subBookingList = this.subBookingList?.filter((obj) => {
      return obj !== item;
    });
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.dataForm?.valid) {
      var data = {
        date_booked: this.dataForm.get('date_booked')?.value,
        date_start: this.dataForm.get('date_start')?.value,
        stay_days: this.dataForm.get('stay_days')?.value,
        status: this.dataForm.get('status')?.value,
        note: this.dataForm.get('note')?.value,
        customer: this.dataForm.get('customer')?.value,
        pet: this.dataForm.get('pet')?.value,
        service: this.dataForm.get('service')?.value,
        room: this.dataForm.get('room')?.value,
      };
      this.dataService.create(data, this.subBookingList).subscribe({
        next: (res) => {
          this.router.navigate([
            '/',
            'management',
            'service-booking',
            'detail',
            res.id,
          ]);
          this.toast.success({
            detail: 'Thành công',
            summary:
              'Đăng ký dịch vụ thành công, hãy đợi dịch vụ được chấp nhận',
            duration: 3000,
          });
        },
        error: (e) => {
          console.log(e);
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Đăng ký dịch vụ thất bại',
            duration: 3000,
          });
        },
      });
    }
  }
}
