import { Component } from '@angular/core';
import { ShowServicePackageComponent } from './show-service-package/show-service-package.component';

@Component({
  selector: 'app-service-package',
  standalone: true,
  imports: [ShowServicePackageComponent],
  templateUrl: './service-package.component.html',
  styleUrl: './service-package.component.css',
})
export class ServicePackageComponent {}
