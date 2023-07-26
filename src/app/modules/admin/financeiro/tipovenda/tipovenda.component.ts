import { AuthService } from '../../../../core/auth/auth.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import {
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    ApexNonAxisChartSeries,
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexResponsive,
    ApexXAxis,
    ApexLegend,
    ApexFill
  } from "ng-apexcharts";


  export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;

  };
  export type ChartOptions1 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    xaxis: ApexXAxis;
    legend: ApexLegend;
    fill: ApexFill;
  };

@Component({
    selector: 'tipovenda',
    templateUrl: './tipovenda.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./tipovenda.component.scss','../../util/css/css.component.scss']

})
export class tipovendaComponent {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public chartOptions1: Partial<ChartOptions1>;
    titulo: string = "Financeiro";
    subTitulo: string = '';
    isToggleOn: boolean;
    constructor() {
        this.chartOptions = {
          series: [44, 55, 13, 43, 22],
          chart: {
            width: 380,
            height: "100%",
            type: "pie"
          },
          labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
        this.chartOptions1 = {
            series: [
              {
                name: "PRODUCT A",
                data: [44, 55, 41, 67, 22, 43, 21, 17, 25, 13, 22, 18]
              },
              {
                name: "PRODUCT B",
                data: [13, 23, 20, 8, 13, 27, 21, 17, 25, 13, 22, 18]
              },
              {
                name: "PRODUCT C",
                data: [11, 17, 15, 15, 21, 14, 21, 17, 25, 13, 22, 18]
              },
              {
                name: "PRODUCT D",
                data: [21, 17, 25, 13, 22, 18, 18, 20,10,12,12,15]
              }
            ],
            chart: {
              type: "bar",
              height: 220,
              stacked: true,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            xaxis: {
              type: "category",
              categories: [
                "01/2011",
                "02/2011",
                "03/2011",
                "04/2011",
                "05/2011",
                "06/2011",
                "07/2011",
                "08/2011",
                "09/2011",
                "10/2011",
                "11/2011",
                "12/2011"
              ]
            },
            legend: {
              position: "bottom"
            },
            fill: {
              opacity: 1
            }
          };
      }
}
