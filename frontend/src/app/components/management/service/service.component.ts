import { Component } from '@angular/core';
import { ShowServiceComponent } from './show-service/show-service.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [ShowServiceComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent {}
