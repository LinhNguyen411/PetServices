import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ServiceBookingService } from '../../../../services/service-booking.service';
import { PetService } from '../../../../services/pet.service';
import { SubServiceBookingService } from '../../../../services/sub-service-booking.service';
import { ServiceBooking } from '../../../../models/service-booking.model';
import { Pet } from '../../../../models/pet.model';
import { SubServiceBooking } from '../../../../models/sub-service-booking.model';
import { DiaryService } from '../../../../services/diary.service';
import { Diary } from '../../../../models/diary.model';
import { Employee } from '../../../../models/employee.model';
import { UserService } from '../../../../services/user.service';
import { NgToastService } from 'ng-angular-popup';
import { ServiceBillService } from '../../../../services/service-bill.service';

import { AddServiceBillComponent } from '../../service-bill/add-service-bill/add-service-bill.component';
import { DetailServiceBillComponent } from '../../service-bill/detail-service-bill/detail-service-bill.component';
import { ServiceBill } from '../../../../models/service-bill.model';

@Component({
  selector: 'app-detail-service-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddServiceBillComponent,
    DetailServiceBillComponent,
  ],
  templateUrl: './detail-service-booking.component.html',
  styleUrl: './detail-service-booking.component.css',
})
export class DetailServiceBookingComponent implements OnInit {
  showStatus(value?: string): string {
    switch (value) {
      case 'a':
        return 'Chấp nhận';
      case 'p':
        return 'Đang tiến hành';
      case 'e':
        return 'Hủy';
      case 'c':
        return 'Hoàn thành';
      case 'u':
        return 'Không chấp nhận';
      default:
        return '';
    }
  }

  private formBuilder = inject(FormBuilder);
  private toast = inject(NgToastService);
  private route = inject(ActivatedRoute);
  private bookingService = inject(ServiceBookingService);
  private subBookingService = inject(SubServiceBookingService);
  private petService = inject(PetService);
  private diaryService = inject(DiaryService);
  private billService = inject(ServiceBillService);
  status: any = '';

  userService = inject(UserService);
  user?: any;
  userData?: any;

  url: string = '../assets/no-img.jpg';
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('photoInput') photoInput: any;

  id = this.route.snapshot.paramMap.get('id');
  data?: ServiceBooking;
  pet?: Pet;
  subBookingList?: SubServiceBooking[];
  diaryList?: Diary[];
  subData?: SubServiceBooking;
  photoStatus?: any;

  isHaveBill?: boolean;
  billData?: ServiceBill;

  diaryForm: FormGroup = this.formBuilder.group({
    id: '',
    content: ['', Validators.required],
    time: '',
    booking: '',
    employeeId: '',
    employeeName: '',
    photo: '',
  });

  constructor() {}
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((res) => {
      this.userData = res;
    });
    if (this.id) {
      this.billService.getAll({ booking_value: this.id }).subscribe((res) => {
        this.isHaveBill = !!res.results[0];
        if (this.isHaveBill) {
          this.billData = res.results[0];
        }
      });
    }
    this.refresh();
  }
  refresh(): void {
    if (this.id) {
      this.bookingService.get(this.id).subscribe((res) => {
        this.data = res;
        this.petService.get(res.pet.id).subscribe((res) => {
          this.pet = res;
        });
        this.status = res.status;
      });
      this.subBookingService
        .getAll({ booking_value: this.id })
        .subscribe((res) => {
          this.subBookingList = res.results;
        });
      this.diaryService.getAll({ booking_value: this.id }).subscribe((res) => {
        this.diaryList = res.results;
      });
    }
  }

  diaryRefresh(): void {
    if (this.id) {
      this.diaryService.getAll({ booking_value: this.id }).subscribe((res) => {
        this.diaryList = res.results;
      });
    }
  }

  updateStatus(value: string): void {
    if (this.data && this.id && this.userData) {
      var send_data = new FormData();
      send_data.append('customer', this.data.customer.id);
      send_data.append('date_start', this.data.date_start);
      send_data.append('pet', this.data.pet.id);
      send_data.append('service', this.data.service.id);
      send_data.append('room', this.data.room.id);
      send_data.append('status', value);
      this.bookingService.update(this.id, send_data).subscribe((res) => {
        var diary_data = new FormData();
        if (this.id) diary_data.append('booking', this.id);
        diary_data.append('employee', this.userData.id);

        if (value == 'a') {
          diary_data.append('content', 'accepted');
        }
        if (value == 'p') {
          diary_data.append('content', 'pet got and procceding');
          diary_data.append('photo', this.fileInput.nativeElement.files[0]);
        }
        if (value == 'c') {
          diary_data.append('content', 'Pet back And completed');
          diary_data.append('photo', this.fileInput.nativeElement.files[0]);
        }
        if (value == 'e') {
          diary_data.append('content', 'Cancelled');
        }
        if (diary_data) {
          this.diaryService.create(diary_data).subscribe((res) => {
            document.getElementById('photo-close-btn')?.click();
            this.refresh();
          });
        }
      });
    }
  }
  triggerComplete(item: any, status: any) {
    if (status == 'ss') {
      this.subData = item;
    }
    this.photoStatus = status;
  }
  completedService() {
    if (this.fileInput.nativeElement.files[0]) {
      if (this.photoStatus == 'ss') {
        if (this.subData && this.subData.id) {
          const data = {
            is_completed: true,
            booking: this.subData.booking,
            service: this.subData.service.id,
          };
          this.subBookingService
            .update(this.subData.id, data)
            .subscribe((res) => {
              var diary_data = new FormData();
              diary_data.append(
                'content',
                `completed ${this.subData?.service.name}`
              );
              if (this.id) diary_data.append('booking', this.id);
              diary_data.append('employee', this.userData.id);
              diary_data.append('photo', this.fileInput.nativeElement.files[0]);
              this.diaryService.create(diary_data).subscribe((res) => {
                document.getElementById('photo-close-btn')?.click();
                this.refresh();
              });
            });
        }
      } else {
        if (this.photoStatus == 'mi') {
          this.updateStatus('p');
        } else if (this.photoStatus == 'mo') {
          this.updateStatus('c');
        }
      }
    } else {
      this.toast.error({
        detail: 'FAILED',
        summary: 'Add Photo to Complete',
        duration: 2000,
      });
    }
  }
  showDetailClick(item: any) {
    if (this.photoInput) this.photoInput.nativeElement.value = '';
    this.url = '../assets/no-img.jpg';
    if (item) {
      this.diaryForm.controls.id.setValue(item.id);
      this.diaryForm.controls.booking.setValue(item.booking);
      this.diaryForm.controls.content.setValue(item.content);
      this.diaryForm.controls.employeeId.setValue(item.employee.id);
      this.diaryForm.controls.employeeName.setValue(item.employee.name);
      this.diaryForm.controls.time.setValue(item.time);
      this.diaryForm.controls.photo.setValue(item.photo);
      this.url = item.photo;
    } else {
      this.diaryForm.controls.id.setValue('');
      this.diaryForm.controls.booking.setValue('');
      this.diaryForm.controls.content.setValue('');
      this.diaryForm.controls.employee.setValue('');
      this.diaryForm.controls.time.setValue('');
      this.diaryForm.controls.photo.setValue('');
    }
  }
  onSubmit() {
    if (!this.diaryForm.controls.content.value) {
      this.toast.error({
        detail: 'FAILED',
        summary: 'Enter Content',
        duration: 2000,
      });
    } else {
      if (this.id && this.userData) {
        var data = new FormData();
        data.append('content', this.diaryForm.get('content')!.value);
        data.append('employee', this.userData.id);
        data.append('booking', this.id);
        if (this.photoInput.nativeElement.files[0]) {
          data.append('photo', this.photoInput.nativeElement.files[0]);
        }
        this.diaryService.create(data).subscribe((res) => {
          document.getElementById('diary-close-btn')?.click();
          this.diaryRefresh();
        });
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
  onSubmitted(submitted: boolean) {
    if (submitted) {
      document.getElementById('bill-close-btn')?.click();
      if (this.id) {
        this.billService.getAll({ booking_value: this.id }).subscribe((res) => {
          this.billData = res.results[0];
          this.isHaveBill = true;
        });
      }
    }
  }
}
