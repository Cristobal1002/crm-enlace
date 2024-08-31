import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { AuthServiceService } from '../../services/auth-service.service';
import { PodiumService } from '../../services/podium.service';
import { ReportsService } from '../../services/reports.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CurrencyFormatPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  activeCampaign: any
  currentUser: any
  totalAmountData: number[] = [];
  totalRecordsData: number[] = [];
  totalRecords: any = 0;
  totalPromise:any = 0;
  labels: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // Labels para los días de la semana


  constructor(private podiumService: PodiumService, private reportsService: ReportsService,
    private authService: AuthServiceService){
    this.currentUser = authService.getUserData()
    this.activeCampaign = {}
    this.getActiveCampaign();
    this.getTotalRecordsAndAmount();
    this.getTotalAmountByDayOfWeek();
    this.getTotalRecordsByDayOfWeek();
  }

  ngAfterViewInit() {}

  getTotalAmountByDayOfWeek() {
    try {
      console.log('usuario actual:', this.currentUser)
      this.reportsService.getTotalAmountByDayOfWeek(this.currentUser).subscribe((response:any)=>{
        this.transformDataForChart(response.data, 'amount');
        this.createPaymentChart();
      });
    } catch (error) {
      console.error('Error fetching total amounts:', error);
    }
  }

   getTotalRecordsByDayOfWeek() {
    try {
      console.log('usuario actual:', this.currentUser)
      const response: any =  this.reportsService.getTotalRecordsByDayOfWeek(this.currentUser).subscribe((response:any)=>{
        this.transformDataForChart(response.data, 'records');
        this.createCallsChart();
      });
    } catch (error) {
      console.error('Error fetching total amounts:', error);
    }
  }

   getTotalRecordsAndAmount() {
    try {
      console.log('usuario actual:', this.currentUser)
        this.reportsService.getTotalRecordsAndAmount(this.currentUser).subscribe((response:any)=>{
        this.totalRecords = response.data.totalRecords
        this.totalPromise = parseInt (response.data.totalAmount)
        console.log('consolidado:', response.data)
      });
      
    } catch (error) {
      console.error('Error fetching total amounts:', error);
    }
  }

  transformDataForChart(data: any, type: 'amount' | 'records') {
    // Inicializa los datos con 0
    const totalData = Array(7).fill(0);

    data.forEach((item: any) => {
        // Convierte dayOfWeek a número
        const dayIndex = parseInt(item.dayOfWeek, 10);

        // Asigna el valor correspondiente al índice
        if (dayIndex >= 0 && dayIndex < 7) {
            // Elige qué valor usar basado en el tipo
            const value = type === 'amount' ? parseInt(item.totalAmount, 10) : parseInt(item.totalRecords, 10);
            totalData[dayIndex] = value;
        }
    });

    // Asigna el resultado a la propiedad correspondiente
    if (type === 'amount') {
        this.totalAmountData = totalData;
    } else {
        this.totalRecordsData = totalData;
    }
}


  createPaymentChart() {
    const ctx = document.getElementById('paymentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Recaudo',
            data: this.totalAmountData,
            backgroundColor: '#3b82f6',
            borderRadius: 10,
            barThickness: 10,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: true
          },
          y: {
            display: true
          }
        }
      }
    });
  }

  createCallsChart() {
    const ctx = document.getElementById('callsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Registros',
            data: this.totalRecordsData,
            backgroundColor: '#7e22ce',
            borderRadius: 10,
            barThickness: 10,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: true
          },
          y: {
            display: true
          }
        }
      }
    });
  }

  getActiveCampaign (){
    return this.podiumService.getActiveCampaign().subscribe((response:any) => {
      console.log('response en Get Actve para ver campaña uno',response)
      this.activeCampaign = response.data[0]   
    })
  }

}
