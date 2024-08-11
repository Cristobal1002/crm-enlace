import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.createPaymentChart();
    this.createCallsChart();
  }

  createPaymentChart() {
    const ctx = document.getElementById('paymentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        datasets: [
          {
            label: 'Recaudo',
            data: [40, 20, 30, 100, 50, 160, 70],
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
        labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        datasets: [
          {
            label: 'Recaudo',
            data: [40, 20, 30, 100, 50, 160, 70],
            backgroundColor: '#4f46e5',
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
}
