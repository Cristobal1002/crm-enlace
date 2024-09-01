import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { Chart, LinearScale } from 'chart.js/auto';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { AuthServiceService } from '../../services/auth-service.service';
import { LoadingService } from '../../services/loading.service';
import { PodiumService } from '../../services/podium.service';
import { ReportsService } from '../../services/reports.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, CurrencyFormatPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  loadingCount = 0;
  activeCampaign: any
  currentUser: any
  totalAmountData: number[] = [];
  totalRecordsData: number[] = [];
  totalRecords: any = 0;
  totalPromise: any = 0;
  totalByDayData:any[] = []; 
  labels: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // Labels para los días de la semana


  constructor(private podiumService: PodiumService, private reportsService: ReportsService,
    private authService: AuthServiceService, private loadingService: LoadingService) {
    this.currentUser = authService.getUserData()
    this.activeCampaign = {}
  }

  ngOnInit() {
    this.loadingService.show();
    this.getActiveCampaign();
    this.getTotalRecordsAndAmount();
    this.getTotalAmountByDayOfWeek();
    this.getTotalRecordsByDayOfWeek();
    this.getTotalByHoursOfDay();
  }

  ngAfterViewInit() { }

  getTotalAmountByDayOfWeek() {
    this.loadingCount++
    try {
      console.log('usuario actual:', this.currentUser)
      this.reportsService.getTotalAmountByDayOfWeek(this.currentUser).subscribe((response: any) => {
        console.log('data grafica amount:', response.data)
        this.transformDataForChart(response.data, 'amount');
        this.createPaymentChart();
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      });
    } catch (error) {
      console.error('Error fetching total amounts:', error);
    }
  }

  getTotalRecordsByDayOfWeek() {
    this.loadingCount++
    try {
      console.log('usuario actual:', this.currentUser)
      this.reportsService.getTotalRecordsByDayOfWeek(this.currentUser).subscribe((response: any) => {
        this.transformDataForChart(response.data, 'records');
        this.createCallsChart();
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      });
    } catch (error) {
      console.error('Error fetching total amounts:', error);
    }
  }

  getTotalRecordsAndAmount() {
    this.loadingCount++
    try {
      console.log('usuario actual:', this.currentUser)
      this.reportsService.getTotalRecordsAndAmount(this.currentUser).subscribe((response: any) => {
        this.totalRecords = response.data.totalRecords
        this.totalPromise = parseInt(response.data.totalAmount) || 0
        console.log('consolidado:', response.data)
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      });

    } catch (error) {
      console.error('Error fetching total amounts:', error);
    }
  }

  getTotalByHoursOfDay(){
    this.loadingCount++
    try {
      this.reportsService.getTotalByHoursOfDay(this.currentUser).subscribe((response:any)=>{
        this.totalByDayData = response.data
        console.log('Data diaria:',this.totalByDayData)
        this.createDailyChart(this.totalByDayData);
        this.loadingCount--;
        if (this.loadingCount === 0) this.loadingService.hide();
      })
      
    } catch (error) {
      console.error('Error armando daily chart:', error);
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

  createDailyChart(data: any[]) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')); // Horas de 00 a 23
    const totalDonations = Array(24).fill(0); // Inicializa con ceros
    const totalAmount = Array(24).fill(0); // Inicializa con ceros
  
    // Llena los datos existentes
    data.forEach(d => {
      const hour = parseInt(d.hour, 10);
      if (hour >= 0 && hour < 24) {
        totalDonations[hour] = parseInt(d.totalDonations, 10) || 0;
        totalAmount[hour] = parseInt(d.totalAmount, 10) || 0;
      }
    });
  
    const ctx = document.getElementById('dailyChart') as HTMLCanvasElement;
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Total llamadas',
            data: totalDonations,
            borderColor: '#7e22ce',
            yAxisID: 'y',
            fill: false,
            borderWidth: 1.5,
          },
          {
            label: 'Total Recaudado',
            data: totalAmount,
            borderColor: '#3b82f6',
            yAxisID: 'y1',
            fill: true,
            borderWidth: 1.5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hour'
            }
          },
          y: {
            type: 'linear',
            display:true,
            position: 'left',
            title: {
              display: true,
              text: 'Total llamadas'
            },
          },
          y1: {
            type: 'linear',
            display:true,
            position: 'right',
            title: {
              display: true,
              text: 'Total Recaudo'
            },
            grid: {
              drawOnChartArea: false // Oculta la cuadrícula en el área del gráfico para el segundo eje
            }
          }
        }
      }
    });
  }
  
  
  
  

  getActiveCampaign() {
    this.loadingCount++
    return this.podiumService.getActiveCampaign().subscribe((response: any) => {
      console.log('response en Get Actve para ver campaña uno', response)
      this.activeCampaign = response.data[0]
      this.loadingCount--;
      if (this.loadingCount === 0) this.loadingService.hide();
    },(error)=>{
      this.loadingCount--;
      if (this.loadingCount === 0) this.loadingService.hide();
    })
  }

}
