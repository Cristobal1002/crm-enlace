import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent {

  userForm: FormGroup;
  isModalOpen = false;
  @Input() isEditMode: boolean = false; // Modo de edición
  @Output() close = new EventEmitter<void>();
  @Input() userData: any;
  @Input() user: any;
  isLoading = false;
  currentUser: any;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthServiceService){
    this.currentUser = this.authService.getUserData();
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.minLength(8)]],
      phone:['', [Validators.required, Validators.minLength(10)]],
      roll:['basic',[Validators.required]],
      status: [true, [Validators.required]]
    })
  }

  //Getters

   //getters
   get nameError(): string | null {
    const fieldControl = this.userForm.get('name');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El nombre es requerido.';
      } else if (fieldControl.hasError('minlength')) {
        return 'El nombre debe tener al menos 3 caracteres.';
      }
    }
    return null;
  }

  get documentError(): string | null {
    const fieldControl = this.userForm.get('document');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El número de documento es requerido.';
      } else if (fieldControl.hasError('minlength')) {
        return 'El número de documento debe tener al menos 8 caracteres.';
      }
    }
    return null;
  }

  get phoneError(): string | null {
    const fieldControl = this.userForm.get('phone');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El número de teléfono es requerido.';
      } else if (fieldControl.hasError('minlength')) {
        return 'El número de teléfono debe tener al menos 10 caracteres.';
      }
    }
    return null;
  }

  get rollError(): string | null {
    const fieldControl = this.userForm.get('roll');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El role  es requerido.';
      } 
    }
    return null;
  }

  get statusError(): string | null {
    const fieldControl = this.userForm.get('status');
    if (fieldControl && (fieldControl.touched || fieldControl.dirty) && fieldControl.invalid) {
      if (fieldControl.hasError('required')) {
        return 'El status  es requerido.';
      } 
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes['user'])
    if (changes['user'] && this.isEditMode && this.user) {
      const data = this.setUserData(this.user);
      this.userForm.patchValue(data);
    }else{
      this.userForm.patchValue(this.userData);
    }
  }

  ngOnInit() {
    if (this.isEditMode && this.userData) {
      this.userForm.patchValue(this.userData);
    }
  }

  setUserData(user: any) {
    const {name, document, phone, roll, status} = user
    return {
      name,
      document,
      phone,
      roll,
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
    this.markAllAsTouched(this.userForm);

    if (this.userForm.valid) {

      if (this.isEditMode) {
        console.log('Entra a editar en onSubmit');
        this.updateUser();
      } else {
        console.log('Entra a crear en onSubmit');
        this.createUser();
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

  createUser() {
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
      const response: any = this.userService.createUser(this.setCreateData()).toPromise();
      console.log('response en create user:', response);

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
        text: 'Hubo un problema al crear el usuario. Por favor, intente nuevamente.',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      this.closeModal();
      this.isLoading = false; // Desactivar el estado de carga
    }
  }

  updateUser() {
    this.isLoading = true; // Activar el estado de carga
    let userToUpdate = this.user

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
      const response: any =  this.userService.updateUser(userToUpdate.id ,this.setUpdateUserData()).toPromise();
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

  setCreateData() {
    const { name, document, phone, roll, status } = this.userForm.value
    return {
      name,
      document,
      phone,
      roll,
      status,
      created_by: this.currentUser.user,
      updated_by: this.currentUser.user
    }
  }

  setUpdateUserData(){
    const { name, document, phone, roll, status } = this.userForm.value
    return {
      name,
      document,
      phone,
      roll,
      status,
      updated_by: this.currentUser.user
    }
  }


}
