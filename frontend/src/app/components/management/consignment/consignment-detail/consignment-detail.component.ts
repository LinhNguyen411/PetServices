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
import { ToastServiceService } from '../../../../services/toast-service.service';

import { ProvideGoods } from '../../../../models/provide-goods.model';
import { ProvideGoodsService } from '../../../../services/provide-goods.service';

import { ConsignmentDiary } from '../../../../models/consignment-diary.model';
import { ConsignmentDiaryService } from '../../../../services/consignment-diary.service';

import { ConsignmentDetail } from '../../../../models/consignment-detail.model';
import { ConsignmentDetailService } from '../../../../services/consignment-detail.service';
import { CareDetailService } from '../../../../services/care-detail.service';
import { ServicePackageDetailService } from '../../../../services/service-package-detail.service';
import { ServicePackageDetail } from '../../../../models/service-package-detail.model';
import { CareDetail } from '../../../../models/care-detail.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentInvoiceComponent } from '../consignment-invoice/consignment-invoice.component';
import { ConsignmentInvoiceService } from '../../../../services/consignment-invoice.service';
import { ConsignmentService } from '../../../../services/consignment.service';

@Component({
  selector: 'app-consignment-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConsignmentInvoiceComponent,
    RouterLink,
  ],
  templateUrl: './consignment-detail.component.html',
  styleUrl: './consignment-detail.component.css',
})
export class ConsignmentDetailComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private toast = inject(ToastServiceService);
  private route = inject(ActivatedRoute);
  private detailService = inject(ConsignmentDetailService);
  private careService = inject(CareDetailService);
  private diaryService = inject(ConsignmentDiaryService);
  private goodsService = inject(ProvideGoodsService);
  private packageDetailService = inject(ServicePackageDetailService);
  private invoiceService = inject(ConsignmentInvoiceService);
  private consignmentService = inject(ConsignmentService);
  private spinner = inject(NgxSpinnerService);

  userService = inject(UserService);
  user?: any;
  userData?: any;

  id = this.route.snapshot.paramMap.get('id');
  data?: ConsignmentDetail;
  careList?: CareDetail[];
  diaryList?: ConsignmentDiary[];
  packageGoodsList?: ServicePackageDetail[];
  goodsList?: ProvideGoods[];
  is_select_package: boolean = true;
  choice_value: string = 'pk';
  goods_value: any = '';

  constructor() {}
  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((res) => {
      this.userData = res;
    });
    if (this.id) {
      this.detailService.get(this.id).subscribe((res) => {
        this.data = res;
        this.packageDetailService
          .getAll({ package_value: res.package.id })
          .subscribe((res) => {
            this.packageGoodsList = res.results;
          });
      });
      this.goodsService.getAllList().subscribe((res) => {
        this.goodsList = res.results;
      });
      this.diaryRefresh();
      this.careRefresh();
    }
  }
  careRefresh(): void {
    if (this.id) {
      this.careService
        .getAll({ con_detail_value: this.id })
        .subscribe((res) => {
          this.careList = res.results;
        });
    }
  }

  diaryRefresh(): void {
    if (this.id) {
      this.diaryService
        .getAll({ con_detail_value: this.id })
        .subscribe((res) => {
          this.diaryList = res.results;
        });
    }
  }
  onChange() {
    if (this.choice_value == 'pk') {
      this.is_select_package = true;
    } else {
      this.is_select_package = false;
    }
    this.goods_value = '';
    console.log(this.is_select_package);
  }

  onSubmit() {
    if (this.id && this.userData) {
      this.spinner.show();
      var diaryData = new FormData();
      diaryData.append('con_detail', this.id);
      diaryData.append('employee', this.userData.id);
      diaryData.append('content', this.goods_value.name);
      this.diaryService.create(diaryData).subscribe({
        next: (res) => {
          document.getElementById('diary-close-btn')?.click();
          this.diaryRefresh();
          this.spinner.hide();
        },
        error: (e) => {
          console.log(e);
          this.spinner.hide();
        },
      });
      if (!this.is_select_package) {
        var is_have = false;
        if (this.careList) {
          for (var item of this.careList) {
            if (item.goods.id == this.goods_value.id && item.count && item.id) {
              var data = {
                count: item.count + 1,
                con_detail: item.con_detail,
                employee: item.employee.id,
                goods: item.goods.id,
              };
              this.careService.update(item.id, data).subscribe((res) => {
                this.careRefresh();
              });
              is_have = true;
              break;
            }
          }
        }
        console.log(is_have);
        if (!is_have) {
          var new_data = {
            count: 1,
            con_detail: this.id,
            employee: this.userData.id,
            goods: this.goods_value.id,
          };
          this.careService.create(new_data).subscribe((res) => {
            this.careRefresh();
          });
        }
      }
    }
  }
  onPaid() {
    if (this.data && this.data.id) {
      this.spinner.show();
      var data = {
        consignment: this.data.consignment,
        is_paid: true,
        pet: this.data.pet.id,
        room: this.data.room,
        package: this.data.package.id,
      };
      this.detailService.update(this.data.id, data).subscribe((res) => {
        this.data = res;
        var invoice_data = {
          employee: this.userData.id,
          con_detail: this.id,
        };
        this.invoiceService.create(invoice_data).subscribe((res) => {
          this.spinner.hide();
        });

        var diaryData = new FormData();
        diaryData.append('con_detail', res.id);
        diaryData.append('employee', this.userData.id);
        diaryData.append('content', 'Trao trả thú cưng và thanh toán');
        this.diaryService.create(diaryData).subscribe({
          next: (res) => {
            this.diaryRefresh();
          },
          error: (e) => {
            console.log(e);
          },
        });
        this.detailService
          .getAll({ consignment_value: res.consignment, is_paid: 'false' })
          .subscribe((itemList) => {
            if (this.data?.consignment) {
              this.consignmentService
                .get(this.data.consignment)
                .subscribe((data) => {
                  if (itemList.results.length > 0) {
                    data.status = 'p';
                  } else {
                    data.status = 'a';
                  }
                  data.employee = data.employee.id;
                  data.customer = data.customer.id;
                  if (data.id)
                    this.consignmentService
                      .update(data.id, data)
                      .subscribe((res) => {});
                });
            }
          });
      });
    }
  }
}
