import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CustomerService } from '../../services/customer.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { ReasonsNoveltiesService } from '../../services/reasons-novelties.service';
import { Observable } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { CustomerModalComponent } from '../../components/customer-modal/customer-modal.component';
import { PodiumService } from '../../services/podium.service';
import { AuthServiceService } from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { DonationService } from '../../services/donation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule,
    SelectDropDownModule, DateFormatPipe, CurrencyFormatPipe, CustomerModalComponent],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent {
  loadingCount = 0;

  donationForm: FormGroup;
  searchForm: FormGroup;
  activeCampaign: any;
  total: any;
  customer: any;
  isModalOpen = false;
  isEditMode = false;
  selectedCustomer: any = null;
  isLoading = false
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
  currentUser: any;
  documentNumber: string = ''; // o el tipo que necesites


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

  constructor(private fb: FormBuilder, private customerService: CustomerService,
    private reasonNoveltyService: ReasonsNoveltiesService, private bankService: BankService,
    private podiumService: PodiumService, private authService: AuthServiceService,
    private donationService: DonationService, private route: ActivatedRoute,
    private loadingService: LoadingService, private router:Router) {
    this.currentUser = this.authService.getUserData()
    this.searchForm = this.fb.group({
      documentNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
    })

    this.donationForm = this.fb.group({
      reasons: ['', [Validators.required]],
      novelties: [[], [Validators.required]],
      petition: [[], [Validators.required]],
      testimony: [''],
      bank: ['', [Validators.required]],
      quotes: [1, [Validators.required]],
      amount: ['', [Validators.required]],
      total: ''
    });
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.route.paramMap.subscribe(params => {
      const document = params.get('document'); // Obtén el parámetro de la URL

      if (document) {
        this.loadCustomer(document);
      }
    });
    this.getActiveCampaign()
    this.loadActiveReasons();
    this.loadActiveNovelties();
    this.loadActiveBanks();
  }

  //Getters boton de buscar
  get documentNumberError(): string | null {
    const documentControl = this.searchForm.get('documentNumber');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'El número de documento es requerido.';
      } else if (documentControl.hasError('minlength')) {
        return 'El número de documento debe tener al menos 8 caracteres.';
      } else if (documentControl.hasError('maxlength')) {
        return 'El número de documento debe tener máximo 10 caracteres.';
      } else if (documentControl.hasError('pattern')) {
        return 'El número de documento solo admite números';
      }
    }
    return null;
  }

  //Getter Donaciones
  get reasonsError(): string | null {
    const documentControl = this.donationForm.get('reasons');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Debe ingresar al menos un motivo';
      }
    }
    return null;
  }

  /*get noveltiesError(): string | null {
    const documentControl = this.donationForm.get('novelties');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Debe ingresar al menos una novedad';
      }
    }
    return null;
  }*/

  get petitionError(): string | null {
    const documentControl = this.donationForm.get('petition');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Le petición es obligatoria';
      }
    }
    return null;
  }

  get bankError(): string | null {
    const documentControl = this.donationForm.get('bank');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Debe seleccionar un banco';
      }
    }
    return null;
  }

  get quotesError(): string | null {
    const documentControl = this.donationForm.get('quotes');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Debe seleccional al menos una cuota';
      }
    }
    return null;
  }

  get amountError(): string | null {
    const documentControl = this.donationForm.get('amount');
    if (documentControl && (documentControl.touched || documentControl.dirty) && documentControl.invalid) {
      if (documentControl.hasError('required')) {
        return 'Debe ingresar el monto';
      }
    }
    return null;
  }


  getCustomerName(): string {
    const customer = this.customer
    return customer.first_name && customer.last_name
      ? this.customerName = `${customer.first_name} ${customer.last_name}`
      : this.customerName = customer.company_name || 'Nombre no disponible';
  }


  getCustomerByDocument() {
    const document = this.searchForm.get('documentNumber')?.value
    if (document) {
      this.isLoading = true
      this.customerService.getCustomerByDocument(document).subscribe((response: any) => {
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
      }, (error) => {
        this.isLoading = false;
      })
    } else {
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

  loadCustomer(document: string): void {
    this.loadingCount++
    console.log('Document en load customer', document)
    this.customerService.getCustomerByDocument(document).subscribe(
      (response:any) => {
        this.customer = response.data;
          this.getCustomerName()
          this.existcustomer = true
          console.log('Customer en la llegada', this.customer)
          this.noFound = false
          this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      },
      (error) => {
        console.error('Error al cargar el cliente:', error);
      }
    );
  }

  onSubmitSearch() {
    console.log('Formulario search:', this.searchForm.value)
    this.markAllAsTouched(this.searchForm);
    if (this.searchForm.valid) {
      this.getCustomerByDocument()
    }
  }

  onSubmitDonation() {
    console.log('Formulario donación:', this.donationForm);
    this.markAllAsTouched(this.donationForm);
  
    if (this.donationForm.valid) {
      console.log('customer en el submit de donation', !this.customer);
      if (!this.customer) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Debes agregar un donante',
          confirmButtonText: 'Aceptar'
        });
      } else {
        const data = this.setDonationData();
        console.log('Data para enviar a crear donacion:', data);
  
        // Llamada para crear la donación
        this.donationService.createDonation(data).subscribe({
          next: (response) => {
            // Resetear el formulario con los valores predeterminados
            this.donationForm.reset({
              reasons: '',
              novelties: [],
              petition: [],
              testimony: '',
              bank: '',
              quotes: 1,
              amount: '',
              total: ''
            });
  
            // Restablecer otras variables relacionadas
            this.customer = null;
            this.customerName = '';
            this.existcustomer = false;
            this.noFound = undefined;
            this.errorMessage = '';
  
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Donación guardada exitosamente',
              confirmButtonText: 'Aceptar'
            });
  
            // Redirigir a la página de donaciones sin el ID en la URL
            this.router.navigate(['/donaciones/manage']);
          },
          error: (error) => {
            console.error('Error al crear la donación:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al guardar la donación',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    }
  }
  
  

  loadActiveReasons(): void {
    this.loadingCount++
    // Llamar al método del servicio para obtener los motivos activos (sin paginación)
    this.activeReasons$ = this.reasonNoveltyService.getActiveReasonList();

    // Suscribirse al observable para manejar los datos
    this.activeReasons$.subscribe({
      next: (response) => {
        this.reasonsList = response.data; // Asume que `response.data` contiene los motivos activos
        console.log('Motivos activos:', this.reasonsList);
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error al cargar los motivos activos:', error);
      }
    });
  }

  loadActiveNovelties(): void {
    this.loadingCount++
    // Llamar al método del servicio para obtener los motivos activos (sin paginación)
    this.activeReasons$ = this.reasonNoveltyService.getActiveNoveltyList();

    // Suscribirse al observable para manejar los datos
    this.activeReasons$.subscribe({
      next: (response) => {
        this.noveltiesList = response.data; // Asume que `response.data` contiene los motivos activos
        console.log('Motivos activos:', this.noveltiesList);
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error al cargar los motivos activos:', error);
      }
    });
  }

  loadActiveBanks(): void {
    this.loadingCount++
    // Llamar al método del servicio para obtener los motivos activos (sin paginación)
    this.activeBanks$ = this.bankService.getActiveBank();

    // Suscribirse al observable para manejar los datos
    this.activeBanks$.subscribe({
      next: (response) => {
        this.banksList = response.data; // Asume que `response.data` contiene los motivos activos
        console.log('Bancos activos:', this.banksList);
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
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

  showCreateModal() {
    this.documentNumber = this.searchForm.get('documentNumber')?.value; // Obtiene el valor del formulario
    this.isModalOpen = true; // Abre el modal
    this.isEditMode = false; // Asegúrate de que sea modo de creación
}


  showEditModal(customer: any) {
    this.isEditMode = true;
    this.selectedCustomer = customer; // Asegúrate que este 'customer' tenga datos
    console.log('Customer seleccionado:', this.selectedCustomer);
    this.isModalOpen = true;
  }

  closeModal() {
    console.log('Entra a close modal')
    this.getCustomerByDocument()
    this.isModalOpen = false;
  }

   getActiveCampaign() {
    this.loadingCount++
    return this.podiumService.getActiveCampaign().subscribe((response: any) => {
      console.log('response en Get Actve para ver campaña', !response.data[0])
      if(!response.data[0]){
        this.noFound = true
        this.errorMessage = 'No existe una campaña activa, por lo tanto los datos no se guardaran'
      }else{
        this.activeCampaign = response.data[0]
      }
      this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
    })
  }

  setDonationData() {
    const data = this.donationForm.value
    // Obtener el valor formateado del input
    let formattedAmount = this.donationForm.get('amount')?.value;

    // Quitar separadores de miles (asumiendo que usas comas)
    let numericAmount = Number(formattedAmount.replace(/\./g, ''));

    return {
      campaign_id: this.activeCampaign.id,
      petition: data.petition,
      testimony: data.testimony,
      account_id: data.bank,
      customer_id: this.customer.id || null,
      user_id: this.currentUser.user,
      quotes: data.quotes,
      amount: numericAmount,
      total_amount: this.total,
      reasons: data.reasons,
      novelties: data.novelties
    }
  }

  createDonation(data: any) {
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
      this.donationService.createDonation(data).subscribe((response: any) => {
        if (response.error) {
          // Mostrar mensaje de error si el documento ya existe
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.error,
            confirmButtonText: 'Aceptar'
          });
        } else {
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Éxito!',
            text: 'Donante creado con éxito',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.closeModal();
          });
        }
        if (response.error) {
          // Mostrar mensaje de error si el documento ya existe
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.error,
            confirmButtonText: 'Aceptar'
          });
        } else {
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Éxito!',
            text: 'Donante creado con éxito',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.existcustomer =false
            this.loadActiveReasons();
            this.loadActiveNovelties();
            this.searchForm.reset()
            this.donationForm.reset()
          });
        }
      })

    } catch (error) {
      // Mostrar mensaje de error genérico
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

}
