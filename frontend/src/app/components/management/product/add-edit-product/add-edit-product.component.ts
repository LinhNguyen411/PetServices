import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { Species } from '../../../../models/species.model';
import { Category } from '../../../../models/category.model';
import { Supplier } from '../../../../models/supplier.model';

import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css',
})
export class AddEditProductComponent {
  private dataService = inject(ProductService);
  private spinner = inject(NgxSpinnerService);
  toast = inject(ToastServiceService);

  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;
  url?: string;

  @ViewChild('fileInput') fileInput: any;

  customer?: any;

  @Output() isSubmitted = new EventEmitter<boolean>();
  @Input() speciesList?: Species[];
  @Input() categoryList?: Category[];
  @Input() supplierList?: Supplier[];

  @Input() set data(value: Product) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      description: value.description,
      category: [value.category, Validators.required],
      species: [value.species, Validators.required],
      supplier: [value.supplier, Validators.required],
      price: [value.price, Validators.required],
      quantity: [value.quantity, Validators.required],
      photo: value.photo,
    });
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
    this.url = value.photo ? value.photo : '../assets/no-img.jpg';
    console.log(value.photo);
  }

  constructor() {}

  add(data: any): void {
    this.dataService.create(data).subscribe({
      next: (res) => {
        this.isSubmitted.emit(true);

        this.toast.addSuccess();
        this.spinner.hide();
      },
      error: (err) => {
        this.toast.addFail();
        this.spinner.hide();
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.dataService.update(this.dataForm.get('id')!.value, data).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.toast.updateSuccess();
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.toast.updateFail();
          this.spinner.hide();
        },
      });
    }
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.dataForm.valid) {
      this.spinner.show();
      var data = new FormData();
      data.append('name', this.dataForm.get('name')!.value);
      data.append('description', this.dataForm.get('description')!.value);
      data.append('category', this.dataForm.get('category')!.value);
      data.append('species', this.dataForm.get('species')!.value);
      data.append('supplier', this.dataForm.get('supplier')!.value);
      data.append('price', this.dataForm.get('price')!.value);
      data.append('quantity', this.dataForm.get('quantity')!.value);
      if (this.fileInput.nativeElement.files[0]) {
        console.log('have file');
        data.append('photo', this.fileInput.nativeElement.files[0]);
      }

      if (this.isUpdate) {
        this.update(data);
      } else {
        this.add(data);
      }
    }
  }
  onSelectFile(e: any): void {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }
}
