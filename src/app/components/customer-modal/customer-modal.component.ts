import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import Pikaday from 'pikaday';
import moment from 'moment';
import Swal from 'sweetalert2';
import { LocationService } from '../../services/location.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AuthServiceService } from '../../services/auth-service.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, SelectDropDownModule],
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements AfterViewInit {

  customerForm: FormGroup;
  documentTypes = [{ type: 'CC', name: 'Cedula de ciudadanía' }, { type: 'PAS', name: 'Pasaporte' }, { type: 'CE', name: 'Cedula de extranjería' }, { type: 'NIT', name: 'Nit' }];
  isCompany: boolean = false;
  countries: any[] = [];
  cities: any[] = [];
  states: any[] = [];
  selectedCountry = {};
  selectedCity = {};
  selectedState: any;
  currentUser: any;
  isLoading = false;

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

  @Input() customerData: any;
  isModalOpen = false;
  @Input() customer: any; // Donante para editar
  @Input() isEditMode: boolean = false; // Modo de edición
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private locationService: LocationService,
    private authService: AuthServiceService, private customerService: CustomerService) {
    this.currentUser = this.authService.getUserData();
    this.getCountries()
    this.customerForm = this.fb.group({
      documentType: ['CC', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
      companyName: [''],
      firstName: [''],
      lastName: [''],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      birthday: [{ value: '', disabled: this.isCompany }],
      gender: [{ value: '', disabled: this.isCompany }],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      neighborhood: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  @ViewChild('datepickerInput') datepickerInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('datepickerButton') datepickerButton: ElementRef<HTMLButtonElement> | undefined;
  pikadayInstance: Pikaday | undefined;

  //getters

  get documentNumberError(): string | null {
    const documentControl = this.customerForm.get('documentNumber');
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

  get documentTypeError(): string | null {
    const documentControl = this.customerForm.get('documentType');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El tipo de documento es requerido.';
      }
    }
    return null;
  }

  get nameError(): string | null {
    const documentControl = this.customerForm.get('firstName');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El nombre es requerido.';
      } else if (documentControl.hasError('minlength')) {
        return 'El nombre debe tener al menos 3 caracteres.';
      }
    }
    return null;
  }

  get lastNameError(): string | null {
    const documentControl = this.customerForm.get('lastName');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El apellido es requerido.';
      } else if (documentControl.hasError('minlength')) {
        return 'El apellido debe tener al menos 3 caracteres.';
      }
    }
    return null;
  }

  get companyNameError(): string | null {
    const documentControl = this.customerForm.get('companyName');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El nombre de la empresa es requerido.';
      } else if (documentControl.hasError('minlength')) {
        return 'El nombre de la empresa debe tener al menos 8 caracteres.';
      }
    }
    return null;
  }

  get phoneError(): string | null {
    const documentControl = this.customerForm.get('phone');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El número de teléfono es requerido.';
      } else if (documentControl.hasError('minlength')) {
        return 'El número de teléfono debe tener al menos 10 caracteres.';
      } else if (documentControl.hasError('pattern')) {
        return 'El número de teléfono solo admite números';
      }
    }
    return null;
  }

  get emailError(): string | null {
    const documentControl = this.customerForm.get('email');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El email es requerido.';
      } else if (documentControl.hasError('pattern')) {
        return 'El formato no coincide con email';
      }
    }
    return null;
  }

  get birthdayError(): string | null {
    const documentControl = this.customerForm.get('birthday');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Fecha de nacimiento es requerida.';
      }
    }
    return null;
  }
  get genderError(): string | null {
    const documentControl = this.customerForm.get('gender');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El sexo es requerido.';
      }
    }
    return null;
  }

  get countryError(): string | null {
    const documentControl = this.customerForm.get('country');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El país es requerido.';
      }
    }
    return null;
  }

  get stateError(): string | null {
    const documentControl = this.customerForm.get('state');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El departamento es requerido.';
      }
    }
    return null;
  }

  get cityError(): string | null {
    const documentControl = this.customerForm.get('city');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'La ciudad es requerida.';
      }
    }
    return null;
  }

  get neighborhoodError(): string | null {
    const documentControl = this.customerForm.get('neighborhood');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El barrio es requerido.';
      }
    }
    return null;
  }

  get addressError(): string | null {
    const documentControl = this.customerForm.get('address');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'La dirección es requerida.';
      }
    }
    return null;
  }




  ngOnInit() {

    if (this.isEditMode && this.customerData) {
      this.customerForm.patchValue(this.customerData);
    }

    // Verificar el estado inicial del campo
    this.updateFieldsValidation();

    this.customerForm.get('documentType')?.valueChanges.subscribe((value) => {
      this.isCompany = value === 'NIT';
      this.updateFieldsValidation();

      if (this.isCompany) {
        this.customerForm.get('firstName')?.reset();
        this.customerForm.get('lastName')?.reset();
        this.customerForm.get('birthday')?.reset();
        this.customerForm.get('gender')?.reset();
        this.customerForm.get('birthday')?.disable();
        this.customerForm.get('gender')?.disable();
      } else {
        this.customerForm.get('companyName')?.reset();
        this.customerForm.get('birthday')?.enable();
        this.customerForm.get('gender')?.enable();
      }
    });
  }

  onSubmit() {
    console.log('Formulario:', this.customerForm.value)

    // Marcar todos los controles como tocados
    this.markAllAsTouched(this.customerForm);

    this.createCustomerData()
    if (this.customerForm.valid) {
      if (this.isEditMode) {
        // Lógica de actualización
      } else {
        console.log('Entra a crear en onSubmit')
        this.createCustomer()
      }
      this.closeModal();
    }
  }

  async createCustomer() {
    this.isLoading = true; // Activar el estado de carga

    try {
      // Mostrar el GIF de carga
      Swal.fire({
        title: 'Enviando...',
        html: 'Por favor, espere mientras se envían los datos.',
        imageUrl: '/assets/gifs/loading-2.gif', 
        imageAlt: 'Cargando',
        showConfirmButton: false,
        allowOutsideClick: false
      });

      // Ejecutar la petición
      const response = await this.customerService.createCustomer(this.createCustomerData()).toPromise();
      console.log('response en create customer:', response);

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Éxito!',
        text: 'Donante creado con exito',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.closeModal();
      });
    } catch (error) {
      console.error('Error en create customer:', error);

      // Mostrar mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Hubo un problema al crear el donante. Por favor, intente nuevamente.',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      this.isLoading = false; // Desactivar el estado de carga
    }
  }


  closeModal() {
    this.close.emit();
  }

  ngAfterViewInit(): void {
    if (this.datepickerInput && this.datepickerButton) {
      this.pikadayInstance = new Pikaday({
        field: this.datepickerInput.nativeElement,
        trigger: this.datepickerButton.nativeElement,
        format: 'YYYY-MM-DD',
        yearRange: [1900, 2100], // Ajusta según tus necesidades
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
            this.customerForm.get('birthday')?.setValue(moment(date).format('YYYY-MM-DD'));
          }
        }
      });

      // Abrir Pikaday cuando se haga clic en el botón
      this.datepickerButton.nativeElement.addEventListener('click', () => {
        this.pikadayInstance?.show();
      });

      // Abrir Pikaday cuando se haga clic en el campo de entrada
      this.datepickerInput.nativeElement.addEventListener('click', () => {
        this.pikadayInstance?.show();
      });
    }
  }

  private updateFieldsValidation() {
    const companyNameControl = this.customerForm.get('companyName');
    const firstNameControl = this.customerForm.get('firstName');
    const lastNameControl = this.customerForm.get('lastName');
    const birthdayControl = this.customerForm.get('birthday');
    const genderControl = this.customerForm.get('gender');


    if (this.isCompany) {
      // Si es empresa, validamos companyName y eliminamos validaciones de firstName y lastName
      companyNameControl?.setValidators([Validators.required, Validators.minLength(8)]);
      firstNameControl?.clearValidators();
      lastNameControl?.clearValidators();
      birthdayControl?.clearAsyncValidators();
      genderControl?.clearValidators();

    } else {
      // Si no es empresa, validamos firstName y lastName, y eliminamos validaciones de companyName
      firstNameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      lastNameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      birthdayControl?.setValidators([Validators.required]);
      genderControl?.setValidators([Validators.required]);
      companyNameControl?.clearValidators();
    }

    // Actualizar validez de los controles
    companyNameControl?.updateValueAndValidity();
    firstNameControl?.updateValueAndValidity();
    lastNameControl?.updateValueAndValidity();
  }

  onDocumentTypeChange() {
    const documentType = this.customerForm.get('documentType')?.value;
    this.isCompany = documentType === 'NIT';

    // Si es empresa, se limpian los campos de nombre y apellidos
    if (this.isCompany) {
      this.customerForm.get('firstName')?.reset();
      this.customerForm.get('lastName')?.reset();
    } else {
      // Si no es empresa, se limpia el campo de razón social
      this.customerForm.get('companyName')?.reset();
    }
  }


  async getCountries() {
    return this.locationService.getCountries().subscribe(response => {
      this.countries = response.data
    })
  }

  async getCitiesByCountry(id: any) {
    return this.locationService.getCitiesByCountry(id).subscribe(response => {
      this.cities = response.data
    })
  }

  async getStateByCity(selectedState: any) {
    return this.locationService.getStateByCity(selectedState).subscribe(response => {
      this.states = response.data
      this.selectedState = this.states[0]
      this.customerForm.get('state')?.setValue(this.selectedState);
    })
  }

  onCountryChange(selectedCountry: any): void {
    let countryCode: number;
    this.selectedCountry = selectedCountry;
    this.customerForm.get('country')?.setValue(selectedCountry);
    countryCode = selectedCountry.value.id
    this.getCitiesByCountry(countryCode)
  }

  onCityChange(selectedCity: any) {
    let stateCode: number;
    this.selectedCity = selectedCity;
    this.customerForm.get('city')?.setValue(selectedCity);
    stateCode = selectedCity.value.state_id
    this.getStateByCity(stateCode)
  }

  createCustomerData() {
    const { documentNumber, documentType, companyName, firstName, lastName, phone, email, birthday, gender, country, state, city, neighborhood, address } = this.customerForm.value;

    const user = this.currentUser.user;
    const country_id = country.value.id;
    const state_id = city.value.state_id;
    const city_id = city.value.id;

    const customerData: any = {
      document: documentNumber,
      document_type: documentType,
      phone,
      email,
      country_id,
      state_id,
      city_id,
      neighborhood,
      address,
      created_by: user,
      updated_by: user
    };

    // Agregar propiedades según 'isCompany'
    if (this.isCompany) {
      customerData.company_name = companyName;
    } else {
      customerData.first_name = firstName;
      customerData.last_name = lastName;
      customerData.birthday = birthday;
      customerData.gender = gender
    }

    console.log('Customer Data:', customerData)
    return customerData;
  }

  private markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control); // Recursivamente para los FormGroups anidados
      }
    });
  }

}
