import { AuthService } from '../../../../core/auth/auth.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { tipovendaService } from './tipovenda.service';
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


  export type ChartOptionsPie = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    yaxis: ApexYAxis;
    responsive: ApexResponsive[];
    labels: any;

  };
  export type ChartOptions1 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    legend: ApexLegend;
    fill: ApexFill;
  };
  export interface tabela {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }

@Component({
    selector: 'tipovenda',
    templateUrl: './tipovenda.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./tipovenda.component.scss','../../util/css/css.component.scss']

})
export class tipovendaComponent {
    @ViewChild("chart") chart: ChartComponent;
    public chartOptionsPie: Partial<ChartOptionsPie>;
    public chartOptions1: Partial<ChartOptions1>;
    displayedColumns: string[] = ['qtde', 'mai', 'jun', 'jul', 'totalGeral'];
    datasource = this._tipovendaService.ELEMENT_DATA;
    titulo: string = "Financeiro";
    subTitulo: string = '';
    isToggleOn: boolean;
    serie

    constructor(private _tipovendaService: tipovendaService) {
        this.chartOptionsPie = {
          series: [ 28753623 ,  67023721 ,  30584983 ,  7394712  ,  103890089   ],
          chart: {
            width: 380,
            height: 400,
            type: "pie"
          },
          labels: ["A Vista", "1 até 30 dias", "31 até 60 dias", "61 até 90 dias", "acima de 9 dias"],
          responsive: [
            {
              breakpoint: 1200,
              options: {
                chart: {
                  width: 200,
                  height: 420
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ],
          yaxis: {
            show: false,
            showAlways: true,
            labels: {
                show: true,
                formatter: (val) => {return(this.formatadorPts(val))},
            }
        },
        };
        this.chartOptions1 = {
            series: [
                {
                  name: "A Vista",
                  data: [4469171	,	 4240401 ,	 3432654,],
                  type: "area",
                },{
                name: "1 até 30 dias",
                data: [10431883 , 10227032 ,	 7637004, ],
                type: "area",
                },
              {
                name: "31 até 60 dias",
                data: [ 4833369 	, 4330621 ,	 3711817,],
                type: "area",
              },
              {
                name: "61 até 90 dias",
                data: [1182992 , 1071140 	, 851728 ,	  ],
                type: "area",
              },
              {
                name: "Acima de 90 dias",
                data: [16924685, 15003348 ,	 11554669	 ],
                type: "area",
                },
                {
                name: "Total",
                color: "black",
                data: [37842099 ,	 34872542,27187870],
                type: "line",
                },
            ],
            chart: {
              type: "area",
              height: 220,
              width: "100%",
              stacked: false,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
            },
            stroke: {
              curve: "smooth",
              width: 2
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
                'Mai',
                'Jun',
                'Jul',
              ]
            },
            dataLabels: {
                distributed: true,
                enabled: false,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold',
                    colors: ['black']
                },
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.2
                }
              },
                yaxis: {
                show: true,
                showAlways: false,
                labels:{
                    formatter: (val) => {return(this.formatadorUnidade(val))}
                },
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: (val) => {return (this.formatadorPts(val))}
                }
              },
            legend: {
              position: "bottom",
            },
          };
      }
      formatadorUnidade(val){
        var numero = val? Number(val).toFixed(0) : '0';
        var valor = numero;
        console.log('TESTE');
        if (String(numero).length < 4) {
            valor = numero;
        }else{
            if (String(numero).length < 7) {
                valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'K';
            } else {
                if (String(numero).length < 8) {
                    valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'M';
                } else {
                    if (String(numero).length < 9) {
                        valor = numero.substring(0,2) +','+ numero.substring(1,2) + 'M';
                    }else{
                        if (String(numero).length < 10) {
                        valor = numero.substring(0,3) +','+ numero.substring(1,2) + 'M';
                        }else{
                            if (String(numero).length < 17) {
                                valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'B';
                            }
                        }
                    }
                }
            }
        }
        return valor;
    }
    formatadorPts(val){
        var valor = val? Number(val).toFixed(2) : '0.00';

        valor = valor.replace('.',',');

        // if(valor.indexOf(",00") == -1)
        if(Number((valor.length)) > 6 && Number(valor.length) < 10){
            var leng = valor.length;
            valor = valor.substring(0,leng-6)+'.'+valor.substring(leng-6,leng);

        }else{
            if(Number((valor.length)) > 9 && Number(valor.length) < 13){
                var leng = valor.length;
                valor = valor.substring(0,leng-9)+'.'+valor.substring(leng-9,leng-6)+'.'+ valor.substring(leng-6,leng)+ ' R$';
            }else{
                if(Number((valor.length)) < 6){
                    var leng = valor.length;
                    valor = valor.substring(0,2)+ '%';
                }else{
                    if(Number(valor === '100,00')){
                        var leng = valor.length;
                        valor = valor.substring(0,3)+ '%';
                    }
                }
            }
        }
        return String(valor);
    }

}
