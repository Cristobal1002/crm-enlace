import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-campaign-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-campaign-modal.component.html',
  styleUrl: './create-campaign-modal.component.css'
})
export class CreateCampaignModalComponent {

  @Output() close = new EventEmitter<void>();

  nombre: string = '';
  rhema: string = '';
  meta: number | null = null;
  texto: string = '';

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    // Lógica para manejar el formulario enviado
    console.log('Nombre:', this.nombre);
    console.log('Rhema:', this.rhema);
    console.log('Meta:', this.meta);
    console.log('Texto:', this.texto);
    this.closeModal();
  }

}
