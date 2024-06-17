import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { VietnamCurrencyPipe } from '../../../../pipes/vietnam-currency.pipe';
import { NgxPrintModule } from 'ngx-print';

import { Consignment } from '../../../../models/consignment.model';
import { ConsignmentService } from '../../../../services/consignment.service';

import { ConsignmentDetail } from '../../../../models/consignment-detail.model';
import { ConsignmentDetailService } from '../../../../services/consignment-detail.service';

import { CareDetail } from '../../../../models/care-detail.model';
import { CareDetailService } from '../../../../services/care-detail.service';
import { ConsignmentInvoice } from '../../../../models/consignment-invoice.model';
import { ConsignmentInvoiceService } from '../../../../services/consignment-invoice.service';

@Component({
  selector: 'app-consignment-invoice',
  standalone: true,
  imports: [CommonModule, VietnamCurrencyPipe, NgxPrintModule],
  templateUrl: './consignment-invoice.component.html',
  styleUrl: './consignment-invoice.component.css',
})
export class ConsignmentInvoiceComponent {
  private consignmentService = inject(ConsignmentService);
  private detailService = inject(ConsignmentDetailService);
  private careService = inject(CareDetailService);
  private invoiceService = inject(ConsignmentInvoiceService);

  bill?: ConsignmentInvoice;
  consignment?: Consignment;
  careList?: CareDetail[];
  detail?: ConsignmentDetail;
  @Input() set data(value_id: string) {
    this.detailService.get(value_id).subscribe((res) => {
      this.detail = res;
      this.invoiceService
        .getAll({ con_detail_value: res.id })
        .subscribe((data) => {
          this.bill = data.results[0];
        });
      this.careService
        .getAll({ con_detail_value: res.id })
        .subscribe((data) => {
          this.careList = data.results;
        });
      if (res.consignment) {
        this.consignmentService.get(res.consignment).subscribe((res) => {
          this.consignment = res;
        });
      }
    });
  }
}
