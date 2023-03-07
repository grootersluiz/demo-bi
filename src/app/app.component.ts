import { Component, OnInit /*, ViewChild, ElementRef*/ } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  //title = 'portal-js-project';

  /*@ViewChild('meuCanvas', { static: true })
  elemento!: ElementRef;*/

  ngOnInit() {
    var myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ],
        datasets: [
          {
            data: [20, 30, 70, 10, 56, 95, 74, 24, 30, 40, 80, 97],
          },
        ],
      },
    });
  }
}
