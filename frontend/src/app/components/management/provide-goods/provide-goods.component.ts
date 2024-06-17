import { Component } from '@angular/core';
import { ShowProvideGoodsComponent } from './show-provide-goods/show-provide-goods.component';

@Component({
  selector: 'app-provide-goods',
  standalone: true,
  imports: [ShowProvideGoodsComponent],
  templateUrl: './provide-goods.component.html',
  styleUrl: './provide-goods.component.css',
})
export class ProvideGoodsComponent {}
