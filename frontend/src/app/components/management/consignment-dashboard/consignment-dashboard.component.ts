import { Component, OnInit, inject } from '@angular/core';
import { ConsignmentDetailService } from '../../../services/consignment-detail.service';
import { ConsignmentDetail } from '../../../models/consignment-detail.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consignment-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './consignment-dashboard.component.html',
  styleUrl: './consignment-dashboard.component.css',
})
export class ConsignmentDashboardComponent implements OnInit {
  private detailService = inject(ConsignmentDetailService);
  detailList?: ConsignmentDetail[];
  constructor() {}
  ngOnInit(): void {
    this.detailService.getAll({ is_paid: 'false' }).subscribe((res) => {
      this.detailList = res.results;
    });
  }
}
