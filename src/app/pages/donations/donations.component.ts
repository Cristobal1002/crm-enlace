import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import Pikaday from 'pikaday';
import moment from 'moment';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements AfterViewInit {

  @ViewChild('datepickerInput') datepickerInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('datepickerButton') datepickerButton: ElementRef<HTMLButtonElement> | undefined;
  pikadayInstance: Pikaday | undefined;

  ngAfterViewInit(): void {
    if (this.datepickerInput && this.datepickerButton) {
      this.pikadayInstance = new Pikaday({
        field: this.datepickerInput.nativeElement,
        trigger: this.datepickerButton.nativeElement,
        format: 'DD-MM-YYYY',
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
            this.datepickerInput.nativeElement.value = moment(date).format('DD-MM-YYYY');
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
