import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-service-booking',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './service-booking.component.html',
  styleUrl: './service-booking.component.css',
})
export class ServiceBookingComponent {}
