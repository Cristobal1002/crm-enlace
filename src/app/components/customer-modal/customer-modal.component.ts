import { CommonModule,} from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Pikaday from 'pikaday';
import moment from 'moment';

@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './customer-modal.component.html',
  styleUrl: './customer-modal.component.css'
})
export class CustomerModalComponent implements AfterViewInit {
  @ViewChild('datepickerInput') datepickerInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('datepickerButton') datepickerButton: ElementRef<HTMLButtonElement> | undefined;
  pikadayInstance: Pikaday | undefined;
  @Input() customerData: any;

  customerForm: FormGroup;
  isModalOpen = false
  @Input() customer: any; // Campaña para editar
  @Input() isEditMode: boolean = false; // Modo de edición
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      country_id: ['', Validators.required],
      department_id: ['', Validators.required],
      city_id: ['', Validators.required],
      neighborhood: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  ngOnInit() {
    if (this.isEditMode && this.customerData) {
      this.customerForm.patchValue(this.customerData);
    }
  }

  onSubmit() {
    if (this.customerForm.valid) {
      if (this.isEditMode) {
        // Lógica de actualización
      } else {
        // Lógica de creación
      }
      this.closeModal();
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
          }
        }
      });

      // Abrir Pikaday cuando se haga clic en el botón
      this.datepickerButton.nativeElement.addEventListener('click', () => {
        this.pikadayInstance?.show();
      });
    }
  }
}
