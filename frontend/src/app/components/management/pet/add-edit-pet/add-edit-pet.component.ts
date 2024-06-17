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
import { CustomerService } from '../../../../services/customer.service';

import { Pet } from '../../../../models/pet.model';
import { PetService } from '../../../../services/pet.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-pet',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-pet.component.html',
  styleUrl: './add-edit-pet.component.css',
})
export class AddEditPetComponent {
  private dataService = inject(PetService);
  private customerService = inject(CustomerService);
  private spinner = inject(NgxSpinnerService);
  toast = inject(NgToastService);
  formBuilder = inject(FormBuilder);
  dataForm!: FormGroup;
  submitted?: boolean;
  isUpdate?: Boolean;
  url?: string;

  @ViewChild('fileInput') fileInput: any;

  customer?: any;

  @Output() isSubmitted = new EventEmitter<boolean>();
  @Input() speciesList?: Species[];

  @Input() set data(value: Pet) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      age: [value.age, Validators.required],
      gender: value.gender,
      owner: [
        { value: value.owner, disabled: value.owner != '' },
        Validators.required,
      ],
      species: [value.species, Validators.required],
      weight: [value.weight, [Validators.required, Validators.min(0.1)]],
      photo: value.photo,
    });
    console.log(value.owner);
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
    this.url = value.photo ? value.photo : '../assets/no-img.jpg';
    console.log(this.url);

    this.searchCustomer();
  }

  constructor() {}
  searchCustomer() {
    if (this.dataForm.get('owner')?.value) {
      this.customerService
        .get(this.dataForm.get('owner')?.value)
        .subscribe((res) => {
          this.customer = res;
        });
    } else {
      this.customer = null;
    }
  }

  add(data: any): void {
    this.dataService.create(data).subscribe({
      next: (res) => {
        this.isSubmitted.emit(true);

        this.toast.success({
          detail: 'Thành công',
          summary: 'Thêm thú cưng thành công',
          duration: 2000,
        });
        this.spinner.hide();
      },
      error: (err) => {
        this.toast.error({
          detail: 'Thất bại',
          summary: 'Thêm thú cưng thất bại',
          duration: 2000,
        });
        this.spinner.hide();
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.dataService.update(this.dataForm.get('id')!.value, data).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.toast.success({
            detail: 'Thành công',
            summary: 'Cập nhật thú cưng thành công',
            duration: 2000,
          });
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.toast.error({
            detail: 'Thất bại',
            summary: 'Cập nhật thú cưng thất bại',
            duration: 2000,
          });
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
      data.append('age', this.dataForm.get('age')!.value);
      data.append('gender', this.dataForm.get('gender')!.value);
      data.append('owner', this.dataForm.get('owner')!.value);
      data.append('species', this.dataForm.get('species')!.value);
      data.append('weight', this.dataForm.get('weight')!.value);
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
