import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import Pikaday from 'pikaday';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule, SelectDropDownModule],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements AfterViewInit {

  donationForm: FormGroup;
  isCompany: boolean = false;
  documentTypes = [{type: 'CC', name: 'Cedula de ciudadanía'},{type: 'NIT', name: 'Nit'}];
  countries: any[] = [];
  cities: any[] = [];
  states: any[]=[]
  selectedCountry = {}
  selectedCity = {}
  selectedState: any
  countryConfig = {
  displayFn: (item: any) => `${item.emoji} ${item.name}` || 'name', // Key to display in the dropdown
  search: true, // Enable search
  height: '200px', // Set a fixed height for the dropdown list
  placeholder: 'Selecciona un país', // Placeholder text
  searchPlaceholder: 'Buscar', // Placeholder text for the search input
  noResultsFound: 'No results found!', // Text to display when no results are found
  searchOnKey: 'name' // Key to perform the search on
};

cityConfig = {
  displayFn: (item: any) => `${item.name} - ${item.state_name}`, // Key to display in the dropdown
  search: true, // Enable search
  height: '200px', // Set a fixed height for the dropdown list
  placeholder: 'Selecciona una ciudad', // Placeholder text
  searchPlaceholder: 'Buscar', // Placeholder text for the search input
  noResultsFound: 'No results found!', // Text to display when no results are found
  searchOnKey: 'name' // Key to perform the search on
};

stateConfig = {
  displayFn: (item: any) => `${item.name}`, // Key to display in the dropdown
  search: true, // Enable search
  height: '200px', // Set a fixed height for the dropdown list
  placeholder: 'Selecciona un departamento', // Placeholder text
  searchPlaceholder: 'Buscar', // Placeholder text for the search input
  noResultsFound: 'No results found!', // Text to display when no results are found
  searchOnKey: 'name' // Key to perform the search on
};

  constructor(private fb: FormBuilder, private locationService: LocationService) {
    this.getCountries()
    this.donationForm = this.fb.group({
      documentType: ['CC', Validators.required],
      documentNumber: ['', Validators.required],
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

  @ViewChild('datepickerInput') datepickerInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('datepickerButton') datepickerButton: ElementRef<HTMLButtonElement> | undefined;
  pikadayInstance: Pikaday | undefined;

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    if (this.datepickerInput && this.datepickerButton) {
      this.pikadayInstance = new Pikaday({
        field: this.datepickerInput.nativeElement,
        trigger: this.datepickerButton.nativeElement,
        format: 'YYYY-MM-DD',
        yearRange: [1900, 2100],
        i18n: {
          previousMonth: 'Mes Anterior',
          nextMonth: 'Mes Siguiente',
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        },
        onSelect: (date: Date) => {
          if (this.datepickerInput) {
            this.datepickerInput.nativeElement.value = moment(date).format('YYYY-MM-DD');
          }
        }
      });

      this.datepickerButton.nativeElement.addEventListener('click', () => {
        this.pikadayInstance?.show();
      });
    }
  }

  onDocumentTypeChange(): void {
    this.donationForm.get('documentType')?.valueChanges.subscribe((selectedType) => {
      if (selectedType === 'NIT') {
        this.isCompany = true;
        this.donationForm.get('companyName')?.setValidators(Validators.required);
        this.donationForm.get('firstName')?.clearValidators();
        this.donationForm.get('lastName')?.clearValidators();
      } else {
        this.isCompany = false;
        this.donationForm.get('companyName')?.clearValidators();
        this.donationForm.get('firstName')?.setValidators(Validators.required);
        this.donationForm.get('lastName')?.setValidators(Validators.required);
      }

      this.donationForm.get('companyName')?.updateValueAndValidity();
      this.donationForm.get('firstName')?.updateValueAndValidity();
      this.donationForm.get('lastName')?.updateValueAndValidity();
    });
  }

  async getCountries(){
    return this.locationService.getCountries().subscribe(response => {
      this.countries = response.data
    })
  }

  async getCitiesByCountry(id:any){
    return this.locationService.getCitiesByCountry(id).subscribe(response => {
      this.cities = response.data
    })
  }

  async getStateByCity(id:any){
    return this.locationService.getStateByCity(id).subscribe(response => {
      this.states = response.data
      console.log('states',id, this.states)
      this.selectedState = this.states[0]
      console.log('Selected State:', this.selectedState)
    this.donationForm.setValue({state: this.selectedState});
    })
  }

  onCountryChange(selectedCountry: any): void {
    let countryCode: number;
    this.selectedCountry = selectedCountry;
    this.donationForm.get('country')?.setValue(selectedCountry);
    countryCode = selectedCountry.value.id
    this.getCitiesByCountry(countryCode)
  }

  onCityChange(selectedCity:any){
    let stateCode:number;
    this.selectedCity = selectedCity;
    this.donationForm.get('city')?.setValue(selectedCity);
    stateCode = selectedCity.value.state_id
    this.getStateByCity(stateCode)
    
  }
  
  onSubmit(){
    console.log('Formulario:', this.donationForm.value)
  }
  
}
