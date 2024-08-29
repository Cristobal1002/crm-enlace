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
import { ReasonsNoveltiesService } from '../../services/reasons-novelties.service';
import { Observable } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule, SelectDropDownModule, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent  {

  donationForm: FormGroup;
  searchForm: FormGroup;
  total: number = 0;
  isCompany: boolean = false;
  customer: any;
  isLoading= false
  noFound: boolean | undefined;
  errorMessage = '';
  existcustomer = false
  customerName = ''
  reasonsList: any[] = []; // Array para almacenar los motivos activos
  noveltiesList: any[] = [];
  reasonsOptions = [];
  noveltiesOptions = [];
  banksList: any[] = [];
  activeBanks$: Observable<any> = new Observable<any>();
  activeReasons$: Observable<any> = new Observable<any>();
  activeNovelties$: Observable<any> = new Observable<any>(); // Inicializar con un Observable vacío
  // Inicializar con un Observable vacío
  

  dropdownConfig = {
    displayKey: "name", // Si tus opciones son objetos, esta es la propiedad que se mostrará
    search: true,              // Activa la barra de búsqueda
    height: 'bottom',            // Altura del dropdown
    placeholder: 'Selecione las opciones',     // Texto del placeholder
    customComparator: () => 0, // Comparador custom, retornando 0 por defecto
    limitTo: 0,                // Límite de opciones mostradas
    moreText: 'más',           // Texto para opciones adicionales
    noResultsFound: 'Sin resultados', // Texto cuando no hay coincidencias
    searchPlaceholder: 'Buscar', // Placeholder para el input de búsqueda
    searchOnKey: 'name', // Clave para buscar si las opciones son objetos
    clearOnSelection: false,   // Limpia la búsqueda al seleccionar
    inputDirection: 'ltr',     // Dirección del texto en el input
    multiple: true,            // Permite la selección múltiple
  };

  constructor(private fb: FormBuilder, private locationService: LocationService, private customerService: CustomerService,
    private reasonNoveltyService: ReasonsNoveltiesService, private bankService: BankService) {
    
    this.searchForm = this.fb.group({
      documentNumber: ['', [Validators.required, Validators.minLength(8)]],
    })

    this.donationForm = this.fb.group({
      reasons: ['', Validators.required],
      novelties: [''],
      petition: [''],
      testimony: [''],
      bank:[''],
      quotes:[1],
      amount:[],
      total:[this.total]
    });
  }

  ngOnInit(): void {
    this.loadActiveReasons();
    this.loadActiveNovelties();
    this.loadActiveBanks();
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

  onSubmitDonation(){}

  loadActiveReasons(): void {
    // Llamar al método del servicio para obtener los motivos activos (sin paginación)
    this.activeReasons$ = this.reasonNoveltyService.getActiveReasonList();

    // Suscribirse al observable para manejar los datos
    this.activeReasons$.subscribe({
      next: (response) => {
        this.reasonsList = response.data; // Asume que `response.data` contiene los motivos activos
        console.log('Motivos activos:', this.reasonsList);
      },
      error: (error) => {
        console.error('Error al cargar los motivos activos:', error);
      }
    });
  }

  loadActiveNovelties(): void {
    // Llamar al método del servicio para obtener los motivos activos (sin paginación)
    this.activeReasons$ = this.reasonNoveltyService.getActiveNoveltyList();

    // Suscribirse al observable para manejar los datos
    this.activeReasons$.subscribe({
      next: (response) => {
        this.noveltiesList = response.data; // Asume que `response.data` contiene los motivos activos
        console.log('Motivos activos:', this.noveltiesList);
      },
      error: (error) => {
        console.error('Error al cargar los motivos activos:', error);
      }
    });
  }

  loadActiveBanks(): void {
    // Llamar al método del servicio para obtener los motivos activos (sin paginación)
    this.activeBanks$ = this.bankService.getActiveBank();

    // Suscribirse al observable para manejar los datos
    this.activeBanks$.subscribe({
      next: (response) => {
        this.banksList = response.data; // Asume que `response.data` contiene los motivos activos
        console.log('Bancos activos:', this.banksList);
      },
      error: (error) => {
        console.error('Error al cargar los bancos activos:', error);
      }
    });
  }

  totalAmount() {
    let value = this.donationForm.get('amount')?.value || '';
    const quotes = this.donationForm.get('quotes')?.value || 1;

    // Eliminar separadores de miles y convertir a número
    value = value.replace(/\./g, '');
    const numericValue = parseFloat(value) || 0;

    // Formatear el valor para visualización
    let formattedValue = numericValue.toString().split('').reverse().join('')
      .replace(/(?=\d*\.?)(\d{3})/g, '$1.')
      .split('').reverse().join('')
      .replace(/^[\.]/, '');

    // Calcular el total
    this.total = numericValue * quotes;

    // Actualizar el valor en el input
    this.donationForm.get('amount')?.setValue(formattedValue, { emitEvent: false });
  }

  showCreateModal(){}

  showEditModal(){}
  
}
