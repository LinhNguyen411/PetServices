import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Consignment } from '../../../../models/consignment.model';
import { ConsignmentService } from '../../../../services/consignment.service';

import { ConsignmentDetail } from '../../../../models/consignment-detail.model';
import { ConsignmentDetailService } from '../../../../services/consignment-detail.service';

import { Customer } from '../../../../models/customer.model';
import { CustomerService } from '../../../../services/customer.service';

import { Pet } from '../../../../models/pet.model';
import { PetService } from '../../../../services/pet.service';

import { ServicePackage } from '../../../../models/service-package.model';
import { ServicePackageComponent } from '../../service-package/service-package.component';

import { Room } from '../../../../models/room.model';
import { RoomService } from '../../../../services/room.service';

import { UserService } from '../../../../services/user.service';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicePackageService } from '../../../../services/service-package.service';

import { AddEditCustomerComponent } from '../../customer/add-edit-customer/add-edit-customer.component';
import { AddEditPetComponent } from '../../pet/add-edit-pet/add-edit-pet.component';
import { Species } from '../../../../models/species.model';
import { SpeciesService } from '../../../../services/species.service';

@Component({
  selector: 'app-add-consignment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AddEditCustomerComponent,
    AddEditPetComponent,
  ],
  templateUrl: './add-consignment.component.html',
  styleUrl: './add-consignment.component.css',
})
export class AddConsignmentComponent implements OnInit {
  private observer = inject(BreakpointObserver);
  private formBuilder = inject(FormBuilder);

  private router = inject(Router);
  private dataService = inject(ConsignmentService);
  private detailService = inject(ConsignmentDetailService);
  private customerService = inject(CustomerService);
  private petService = inject(PetService);
  private roomService = inject(RoomService);
  private packageService = inject(ServicePackageService);
  private speciesService = inject(SpeciesService);

  userService = inject(UserService);

  private toast = inject(ToastServiceService);
  private spinner = inject(NgxSpinnerService);

  user?: any;
  userData?: any;
  customer?: any;
  data?: Consignment;
  itemList: ConsignmentDetail[] = [];
  petList: Pet[] = [];
  packageList: ServicePackage[] = [];
  roomList: Room[] = [];
  dataForm: FormGroup = this.formBuilder.group({
    status: 'u',
    employee: ['', Validators.required],
    customer: ['', Validators.required],
  });
  subDataForm: FormGroup = this.formBuilder.group({
    pet: ['', Validators.required],
    room: ['', Validators.required],
    package: ['', Validators.required],
  });

  submitted?: boolean;
  subSubmitted?: boolean;
  isMobile?: boolean;

  customer_data: Customer = {
    id: '',
    name: '',
    address: '',
    phone_number: '',
    account: null,
  };

  pet_data: Pet = {
    id: '',
    name: '',
    age: 0,
    gender: false,
    owner: '',
    species: '',
    weight: 0,
    photo: '',
  };
  speciesList?: Species[];

  constructor() {
    console.log('hello');
  }
  ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.userService.userData$.subscribe((res) => {
      this.userData = res;
    });
    this.userService.userData$.subscribe((userData) => {
      if (userData) {
        this.dataForm.patchValue({
          employee: userData.id,
        });
      }
    });
    this.packageService.getAll().subscribe((res) => {
      this.packageList = res.results;
    });
    this.roomService.getAll({ is_booked: 'false' }).subscribe((res) => {
      this.roomList = res.results;
    });
    this.speciesService.getAll().subscribe((res) => {
      this.speciesList = res.results;
    });
    this.refresh();
  }
  refresh(): void {
    this.customer = null;
    this.submitted = false;
    this.subSubmitted = false;
    this.itemList = [];
    this.dataForm.controls.customer.setValue('');
  }
  searchCustomer() {
    if (this.dataForm.get('customer')?.value) {
      this.customerService
        .searchByValue(this.dataForm.get('customer')?.value)
        .subscribe((res) => {
          if (res.results[0]) {
            this.customer = res.results[0];
          }
          this.changeCustomer(this.customer.id);
        });
    } else {
      this.customer = '';
      this.petList = [];
    }
  }
  changeCustomer(id: string) {
    this.dataForm.controls.customer.setValue(id);
    this.searchPet(id);
  }
  searchPet(id: string) {
    this.petService.getAll({ owner_value: id }).subscribe((petLst) => {
      this.detailService.getAll({ is_paid: 'false' }).subscribe((res) => {
        this.petList = petLst.results;
        const detailList = res.results;
        this.petList = this.petList.filter((pet) => {
          var is_serving = true;
          detailList.map((item: any) => {
            if (item.pet.id == pet.id) is_serving = false;
          });
          return is_serving;
        });
      });
    });
    this.pet_data = {
      id: '',
      name: '',
      age: 0,
      gender: false,
      owner: id,
      species: '',
      weight: 0,
      photo: '',
    };
  }
  deleteClick(item: any) {
    this.itemList = this.itemList.filter((obj) => {
      return obj !== item;
    });
    this.roomList.push(item.room);
    this.petList.push(item.pet);
    this.subDataForm.controls.pet.setValue('');
    this.subDataForm.controls.package.setValue('');
    this.subDataForm.controls.room.setValue('');
  }
  onSubSubmit() {
    this.subSubmitted = true;
    const pet = this.subDataForm.get('pet')?.value;
    const room = this.subDataForm.get('room')?.value;
    if (this.subDataForm.valid) {
      var item = {
        pet: pet,
        package: this.subDataForm.get('package')?.value,
        room: room,
      };
      this.itemList.push(item);
      this.subSubmitted = false;
      this.petList = this.petList.filter((item) => {
        return item.id != pet.id;
      });

      this.roomList = this.roomList.filter((item) => {
        return item.id != room.id;
      });

      this.subDataForm.controls.pet.setValue('');
      this.subDataForm.controls.package.setValue('');
      this.subDataForm.controls.room.setValue('');
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.dataForm.valid && this.itemList.length > 0) {
      this.spinner.show();
      var data = {
        status: this.dataForm.get('status')?.value,
        customer: this.dataForm.get('customer')?.value,
        employee: this.dataForm.get('employee')?.value,
      };
      this.dataService.create(data, this.itemList).subscribe({
        next: (res) => {
          this.spinner.hide();
          this.router.navigate([
            '/',
            'management',
            'consignment',
            'detail',
            res.id,
          ]);
          this.toast.success('Tạo phiếu ký gửi thành công!');
        },
        error: (err) => {
          this.spinner.hide();
          console.log(err);
          this.toast.fail('Tạo phiếu ký gửi thất bại!');
        },
      });
    }
  }
  onCusSubmitted(customer: any) {
    if (customer) {
      document.getElementById('add-cus-close-btn')?.click();
      this.customer = customer;
      this.changeCustomer(this.customer.id);
    }
  }
  onPetSubmitted(submitted: boolean) {
    if (submitted) {
      this.searchPet(this.customer.id);
      document.getElementById('add-pet-close-btn')?.click();
    }
  }
}
