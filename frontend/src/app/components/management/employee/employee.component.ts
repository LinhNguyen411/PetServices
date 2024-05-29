import { Component } from '@angular/core';
import { ShowEmployeeComponent } from './show-employee/show-employee.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ShowEmployeeComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent {}
