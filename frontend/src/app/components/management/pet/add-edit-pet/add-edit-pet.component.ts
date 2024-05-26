import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

import { Weight } from '../../../../models/weight.model';
import { WeightService } from '../../../../services/weight.service';
import { Species } from '../../../../models/species.model';
import { CustomerService } from '../../../../services/customer.service';

import { Pet } from '../../../../models/pet.model';
import { PetService } from '../../../../services/pet.service';

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

  private weightService = inject(WeightService);
  weightList?: Weight[];

  @Input() set data(value: Pet) {
    this.dataForm = this.formBuilder.group({
      id: value.id,
      name: [value.name, Validators.required],
      age: [value.age, Validators.required],
      gender: [value.gender, Validators.required],
      owner: [value.owner, Validators.required],
      species: [value.species, Validators.required],
      weight: [value.weight, Validators.required],
      photo: value.photo,
    });
    this.submitted = false;
    this.isUpdate = !!value.id;
    this.isSubmitted.emit(false);
    this.url = value.photo ? value.photo : '../assets/no-img.jpg';

    this.speciesChange();
    this.searchCustomer();
  }

  constructor() {}
  speciesChange() {
    this.weightService.species_filter(this.dataForm.get('species')?.value);
    this.weightService.getAll().subscribe((res) => {
      this.weightList = res.results;
    });
  }
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
          detail: 'SUCCESS',
          summary: 'Add Item Successfully',
          duration: 2000,
        });
      },
      error: (err) => {
        this.toast.error({
          detail: 'FAILED',
          summary: 'Failed To Add',
          duration: 2000,
        });
      },
    });
  }
  update(data: any): void {
    if (this.dataForm.get('id')!.value) {
      this.dataService.update(this.dataForm.get('id')!.value, data).subscribe({
        next: (res) => {
          this.isSubmitted.emit(true);

          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Update Item Successfully',
            duration: 2000,
          });
        },
        error: (err) => {
          console.log(err);
          this.toast.error({
            detail: 'FAILED',
            summary: 'Failed To Update',
            duration: 2000,
          });
        },
      });
    }
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.dataForm.valid) {
      console.log('hello');
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
