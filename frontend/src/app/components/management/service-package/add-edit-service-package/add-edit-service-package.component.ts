import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from '../../../../services/toast-service.service';

import { ServicePackage } from '../../../../models/service-package.model';
import { ServicePackageService } from '../../../../services/service-package.service';

import { ServicePackageDetail } from '../../../../models/service-package-detail.model';
import { ServicePackageDetailService } from '../../../../services/service-package-detail.service';

import { FormsModule } from '@angular/forms';

import { ProvideGoodsService } from '../../../../services/provide-goods.service';
import { ProvideGoods } from '../../../../models/provide-goods.model';

@Component({
  selector: 'app-add-edit-service-package',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-edit-service-package.component.html',
  styleUrl: './add-edit-service-package.component.css',
})
export class AddEditServicePackageComponent {
  private spinner = inject(NgxSpinnerService);
  private toast = inject(ToastServiceService);
  private dataService = inject(ServicePackageService);
  private provideGoodService = inject(ProvideGoodsService);
  private detailService = inject(ServicePackageDetailService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;

  goodsList?: ProvideGoods[];
  goodsValue?: ProvideGoods;
  itemList: ServicePackageDetail[] = [];

  @Output() isSubmitted = new EventEmitter<boolean>();

  @Input() set data(value: ServicePackage) {
    this.itemList = [];
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      price: [value.price, [Validators.required, Validators.min(1000)]],
    });
    this.provideGoodService.getAllList().subscribe((res) => {
      this.goodsList = res.results;
    });

    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
    if (this.isUpdate) {
      this.detailService
        .getAll({ package_value: value.id })
        .subscribe((res) => {
          this.itemList = res.results;
        });
    }
  }

  constructor() {}

  add(data: any): void {
    this.dataService.create(data, this.itemList).subscribe({
      next: (res) => {
        this.isSubmitted.emit(true);

        this.toast.addSuccess();
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.toast.addFail();
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
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.toast.updateFail();
          this.spinner.hide();
        },
      });
    }
  }

  addItem() {
    if (this.goodsValue) {
      var is_change = false;
      this.itemList = this.itemList.map((item) => {
        if (item.goods.id == this.goodsValue?.id) {
          is_change = true;
          return item;
        }
        return item;
      });
      if (!is_change) {
        this.itemList?.push({ id: '', goods: this.goodsValue });
        if (this.isUpdate) {
          this.spinner.show();
          var data = {
            package: this.dataForm.get('id')!.value,
            goods: this.goodsValue?.id,
          };
          this.detailService.create(data).subscribe((res) => {
            this.spinner.hide();
          });
        }
      }
    }
  }
  deleteItem(item: any) {
    this.itemList = this.itemList.filter((obj) => {
      return obj !== item;
    });
    if (this.isUpdate) {
      this.spinner.show();
      this.detailService.delete(item.id).subscribe((res) => {
        this.spinner.hide();
      });
    }
  }

  onSubmit(): void {
    console.log('hello');
    this.submitted = true;
    if (this.dataForm.valid) {
      this.spinner.show();
      var data = new FormData();
      data.append('name', this.dataForm.get('name')!.value);
      data.append('price', this.dataForm.get('price')!.value);

      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
}
