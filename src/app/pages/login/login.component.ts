import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router'; // Asegúrate de importar ActivatedRoute
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isPasswordVisible = false; 
  isLoading = false;
  alert = false;
  alertMessage = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthServiceService, 
    private router: Router, 
    private route: ActivatedRoute // Añadir ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Aquí se maneja el query param `sessionExpired`
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.alert = true;
        this.alertMessage = 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.';
        setTimeout(() => {
          this.alert = false;
        }, 5000);
      }
    });
  }

  get username() {
    return this.loginForm.get('user');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    this.isLoading = true;
    
    if (this.loginForm.valid) {
      const { user, password } = this.loginForm.value;
      
      this.authService.login({ user, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoading = false;
          this.showAlert(err.message || 'Error desconocido');
        }
      });
      
    } else {
      this.isLoading = false;
      this.showAlert('Formulario inválido');
    }
  }
  
  // Método para mostrar la alerta y ocultarla después de 3 segundos
  private showAlert(message: string) {
    this.alert = true;
    this.alertMessage = message;
    setTimeout(() => {
      this.alert = false;
    }, 3000);
  }
  
}
