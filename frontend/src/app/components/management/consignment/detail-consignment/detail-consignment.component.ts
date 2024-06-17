import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserService } from '../../../../services/user.service';

import { ConsignmentService } from '../../../../services/consignment.service';
import { Consignment } from '../../../../models/consignment.model';

import { ConsignmentDetail } from '../../../../models/consignment-detail.model';
import { ConsignmentDetailService } from '../../../../services/consignment-detail.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-detail-consignment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './detail-consignment.component.html',
  styleUrl: './detail-consignment.component.css',
})
export class DetailConsignmentComponent implements OnInit {
  getStatus(status?: string): string {
    switch (status) {
      case 'e':
        return 'Hủy';
      case 'u':
        return 'Chưa thanh toán';
      case 'p':
        return 'Thanh toán một phần';
      case 'a':
        return 'Thanh toán toàn bộ';
      default:
        return '';
    }
  }

  private route = inject(ActivatedRoute);
  private dataService = inject(ConsignmentService);
  private detailService = inject(ConsignmentDetailService);
  private spinner = inject(NgxSpinnerService);
  userService = inject(UserService);

  user?: any;
  userData?: any;
  consignment?: Consignment;
  detailList?: ConsignmentDetail[];
  paidList?: ConsignmentDetail[];
  id = this.route.snapshot.paramMap.get('id');

  constructor() {}
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((res) => {
      this.userData = res;
    });
    if (this.id) {
      this.dataService.get(this.id).subscribe((res) => {
        this.consignment = res;
      });
      this.detailService
        .getAll({ consignment_value: this.id, is_paid: 'false' })
        .subscribe((res) => {
          this.detailList = res.results;
        });
      this.detailService
        .getAll({ consignment_value: this.id, is_paid: 'true' })
        .subscribe((res) => {
          this.paidList = res.results;
        });
    }
  }
  onCancel() {
    if (this.consignment?.id && this.detailList) {
      this.spinner.show();
      var data = {
        customer: this.consignment?.customer,
        employee: this.consignment?.employee,
        date_time_create: this.consignment?.date_time_create,
        status: 'e',
      };
      this.dataService
        .cancelUpdate(this.consignment?.id, data, this.detailList)
        .subscribe((res) => {
          this.spinner.hide();
        });
    }
  }
}
