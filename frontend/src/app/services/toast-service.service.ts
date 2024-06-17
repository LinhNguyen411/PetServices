import { Injectable, inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class ToastServiceService {
  private toast = inject(NgToastService);
  constructor() {}
  success(message: string) {
    this.toast.success({
      detail: 'Thành công',
      summary: message,
      duration: 3000,
    });
  }
  fail(message: string) {
    this.toast.error({
      detail: 'Thất bại',
      summary: message,
      duration: 3000,
    });
  }
  addSuccess(): void {
    this.toast.success({
      detail: 'Thành công',
      summary: 'Thêm đối tượng thành công',
      duration: 3000,
    });
  }
  addFail(): void {
    this.toast.error({
      detail: 'Thất bại',
      summary: 'Thêm đối tượng thất bại',
      duration: 3000,
    });
  }

  updateSuccess(): void {
    this.toast.success({
      detail: 'Thành công',
      summary: 'Cập nhật đối tượng thành công',
      duration: 3000,
    });
  }
  updateFail(): void {
    this.toast.error({
      detail: 'Thất bại',
      summary: 'Cập nhật đối tượng thất bại',
      duration: 3000,
    });
  }

  deleteSuccess(): void {
    this.toast.success({
      detail: 'Thành công',
      summary: 'Xóa đối tượng thành công',
      duration: 3000,
    });
  }
  deleteFail(): void {
    this.toast.error({
      detail: 'Thất bại',
      summary: 'Xóa đối tượng thất bại',
      duration: 3000,
    });
  }
}
