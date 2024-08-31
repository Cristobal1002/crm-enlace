import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../services/auth-service.service';
import { BankService } from '../../services/bank.service';


@Component({
  selector: 'app-bank-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bank-modal.component.html',
  styleUrl: './bank-modal.component.css'
})
export class BankModalComponent {

  bankForm: FormGroup;
  isModalOpen = false;
  @Input() isEditMode: boolean = false; // Modo de edición
  @Output() close = new EventEmitter<void>();
  @Input() bankData: any;
  @Input() bank: any;
  isLoading = false;
  currentUser: any;

  constructor(private fb: FormBuilder, private bankService: BankService, private authService: AuthServiceService) {
    this.currentUser = this.authService.getUserData();
    this.bankForm = this.fb.group({
      name: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      additionalInfo: [''],
      link: [''],
      status: [true]
    })

  }

  //getters
  get nameError(): string | null {
    const fieldControl = this.bankForm.get('name');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El nombre es requerido.';
      } else if (fieldControl.hasError('minlength')) {
        return 'El nombre debe tener al menos 3 caracteres.';
      }
    }
    return null;
  }

  //getters
  get accountNumberError(): string | null {
    const fieldControl = this.bankForm.get('accountNumber');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El número de cuenta es requerido.';
      } else if (fieldControl.hasError('minlength')) {
        return 'El nombre debe tener al menos 3 caracteres.';
      }
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bank'] && this.isEditMode && this.bank) {
      const data = this.setbankData(this.bank);
      this.bankForm.patchValue(data);
    }
  }


  ngOnInit() {
    if (this.isEditMode && this.bankData) {
      this.bankForm.patchValue(this.bankData);
    }
  }

  setbankData(bank: any) {
    const {name, account_number, additional_data, pay_link, status} = bank
    return {
      name,
      accountNumber: account_number,
      additionalInfo: additional_data,
      link: pay_link,
      status
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.close.emit();
    this.isModalOpen = false;
  }

  onSubmit() {
    this.markAllAsTouched(this.bankForm);

    if (this.bankForm.valid) {

      if (this.isEditMode) {
        console.log('Entra a editar en onSubmit');
        this.updateBank();
      } else {
        console.log('Entra a crear en onSubmit');
        this.createBank();
      }
      this.closeModal();
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

 createBank() {
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
      console.log('Data armada:', this.setCreateData())
      const response: any =  this.bankService.createBank(this.setCreateData()).toPromise();
      console.log('response en create customer:', response);

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
        })
      }
    } catch (error) {
      console.error('Error en create customer:', error);

      // Mostrar mensaje de error genérico
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Hubo un problema al crear el banco. Por favor, intente nuevamente.',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      this.closeModal();
      this.isLoading = false; // Desactivar el estado de carga
    }
  }
  updateBank() {
    this.isLoading = true; // Activar el estado de carga
    let bankToUpdate = this.bank

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
      console.log('Data armada:', this.setCreateData())
      const response: any =  this.bankService.updateBank(bankToUpdate.id ,this.setUpdateBankData()).toPromise();
      console.log('response en create customer:', response);

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
    } catch (error) {
      console.error('Error en create customer:', error);

      // Mostrar mensaje de error genérico
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Hubo un problema al crear el banco. Por favor, intente nuevamente.',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      this.isLoading = false; // Desactivar el estado de carga
    }
  }

  setCreateData() {
    const { name, accountNumber, additionalInfo, link, status } = this.bankForm.value
    return {
      name,
      account_number: accountNumber,
      additional_data: additionalInfo,
      pay_link: link,
      status,
      created_by: this.currentUser.user,
      updated_by: this.currentUser.user
    }
  }

  setUpdateBankData(){
    const { name, accountNumber, additionalInfo, link, status } = this.bankForm.value
    return {
      name,
      account_number: accountNumber,
      additional_data: additionalInfo,
      pay_link: link,
      status,
      updated_by: this.currentUser.user
    }
  }

}
