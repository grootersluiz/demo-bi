import { Component, ViewChild,Injectable } from "@angular/core";
// import { ElementRef } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexResponsive,
  ApexYAxis,
  // ApexFill
} from "ng-apexcharts";

import { VendafilialService } from "../vendafilial.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  yaxis: ApexYAxis[]; 
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};



@Component({
  selector: "app-vendafilialchart",
  templateUrl: "./vendafilialchart.component.html",
  styleUrls: ["./vendafilialchart.component.scss"]
  // providers: [ChartService]  
})

@Injectable()
export class VendafilialchartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  
  _colors = {
    palette1: ['#008FFB','#00E396','#FEB019','#FF4560','#775DD0'],
    palette2: ['#3F51B5','#03A9F4','#4CAF50','#F9CE1D','#FF9800'],
    palette3: ['#33B2DF','#546E7A','#D4526E','#13D8AA','#A5978B'],
    palette4: ['#4ECDC4','#C7F464','#81D4FA','#546E7A','#FD6A6A'],
    palette5: ['#2B908F','#F9A3A4','#90EE7E','#FA4443','#69D2E7'],
    palette6: ['#449DD1','#F86624','#EA3546','#662E9B','#C5D86D'],
    palette7: ['#D7263D','#1B998B','#2E294E','#F46036','#E2C044'],
    palette8: ['#662E9B','#F86624','#F9C80E','#EA3546','#43BCCD'],
    palette9: ['#5C4742','#A5978B','#8D5B4C','#5A2A27','#C4BBAF'],
    palette10: ['#A300D6','#7D02EB','#5653FE','#2983FF','#00B1F2']
  };

  constructor(private _serviceVendafilial: VendafilialService, ) {

    console.log(this._colors);

    this.chartOptions = {
      series: [
        {
          name: "ROL",
          data: [
            { y: 10, x: "18"},
            { y: 41, x: "19"},
            { y: 35, x: "20"},
            { y: 51, x: "21"},
            { y: 49, x: "22"},
            { y: 62, x: "23"},
            { y: 69, x: "24"},
            { y: 91, x: "25"},
            { y: 148, x: "26"}
            ]
        },
        {
          name: "ROB",
          data: [
            { y: 10, x: "18"},
            { y: 50, x: "19"},
            { y: 43, x: "20"},
            { y: 30, x: "21"},
            { y: 54, x: "22"},
            { y: 42, x: "23"},
            { y: 39, x: "24"},
            { y: 120, x: "25"},
            { y: 78, x: "26"}
          ]
        }
      ],
      chart: {
        width: "100%",
        height: '100%',
        type: "area",
        stacked: false,
        zoom: {
          enabled: true,
          type: 'xy', 
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: " Dia ",
        align: "left"
      },
      yaxis: [
        {
          show: true,
          title: {
            text: 'ROL',
            style: {
              color: this._colors.palette1[0],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: true,
            minWidth: 0,
            maxWidth: 20,
            style: {
              colors: this._colors.palette1[0],
              cssClass: 'apexcharts-yaxis-label'
            }
          }
        },
        {
          show: false,
          title: {
            text: 'ROB',
            style: {
              color: this._colors.palette1[1],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: '',
            }
          },
          labels: {
            show: false,
            minWidth: 0,
            maxWidth: 60,
            style: {
              colors: this._colors.palette1[1],
              cssClass: 'apexcharts-yaxis-label'
            }
          }
        }
      ],
      xaxis: {
          type: 'category',
          categories: ["18","19","20","21","22","23","24","25","26"]
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

  }
}
