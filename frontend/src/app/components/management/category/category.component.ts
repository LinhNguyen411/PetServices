import { Component } from '@angular/core';
import { ShowCategoryComponent } from './show-category/show-category.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ShowCategoryComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {}
