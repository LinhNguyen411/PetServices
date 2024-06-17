import { Component } from '@angular/core';
import { ShowRoomComponent } from './show-room/show-room.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [ShowRoomComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent {}
