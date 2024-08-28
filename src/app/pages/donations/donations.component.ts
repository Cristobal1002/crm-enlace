import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import Pikaday from 'pikaday';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CustomerService } from '../../services/customer.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule, SelectDropDownModule, DateFormatPipe],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements AfterViewInit {

  donationForm: FormGroup;
  searchForm: FormGroup;
  isCompany: boolean = false;
  customer: any;
  countries: any[] = [];
  cities: any[] = [];
  states: any[]=[]
  selectedCountry = {}
  selectedCity = {}
  selectedState: any
  isLoading= false
  noFound: boolean | undefined;
  errorMessage = '';
  existcustomer = false
  customerName = ''


  constructor(private fb: FormBuilder, private locationService: LocationService, private customerService: CustomerService) {
    this.searchForm = this.fb.group({
      documentNumber: ['', [Validators.required, Validators.minLength(8)]],
    })

    this.donationForm = this.fb.group({
      documentType: ['', Validators.required],
      companyName: [''],
      firstName: [''],
      lastName: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  //Getters
  get documentNumberError(): string | null {
    const documentControl = this.searchForm.get('documentNumber');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El número de documento es requerido.';
      } else if (documentControl.hasError('minlength')) {
        return 'El número de documento debe tener al menos 8 caracteres.';
      } else if (documentControl.hasError('pattern')) {
        return 'El número de documento solo admite números';
      }
    }
    return null;
  }

  getCustomerName(): string {
    const customer = this.customer
    return customer.first_name && customer.last_name
      ? this.customerName =`${customer.first_name} ${customer.last_name}`
      : this.customerName = customer.company_name || 'Nombre no disponible';
  }


   getCustomerByDocument() {
    const document = this.searchForm.get('documentNumber')?.value
    if(document){
      this.isLoading= true
      this.customerService.getCustomerByDocument(document).subscribe((response:any) => {
        console.log('response', response)
        if (response.data) {
          this.customer = response.data;
          this.getCustomerName()
          this.existcustomer = true
          console.log('Customer en la busqueda', this.customer)
          this.noFound = false
        } else {
          this.noFound = true
          this.errorMessage = 'No encontramos un cliente con ese número de documento'
          this.existcustomer = false
         
        }
        this.isLoading = false;
      },(error)=>{
        this.isLoading = false;
      })
    }else {
      console.error('Document number is required');
    }
  }





  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {

  }

  private markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control); // Recursivamente para los FormGroups anidados
      }
    });
  }

  onSubmitSearch(){
    console.log('Formulario search:', this.searchForm.value)
    this.markAllAsTouched(this.searchForm);
    if(this.searchForm.valid){
      this.getCustomerByDocument()
    }
  }

  onSubmit(){}

  showCreateModal(){}

  showEditModal(){}


 
  
}
