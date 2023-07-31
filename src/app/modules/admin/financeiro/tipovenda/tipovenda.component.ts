import { AuthService } from '../../../../core/auth/auth.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { tipovendaService } from './tipovenda.service';
import {
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'tipovenda',
    templateUrl: './tipovenda.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './tipovenda.component.scss',
        '../../util/css/css.component.scss',
    ],
})
export class tipovendaComponent {
    chartOptionsPie: ApexOptions;
    chartOptions1: ApexOptions;
    heatMap: ApexOptions;
    @ViewChild('chart') chart: ChartComponent;
    datasource = this._tipovendaService.ELEMENT_DATA;
    titulo: string = 'Financeiro';
    subTitulo: string = '';
    isToggleOn: boolean;
    serie;
    totals = [];



    ngOnInit() {
        // Primeiro, crie um objeto para armazenar as somas temporárias


        const tempTotals = {};

        // Em seguida, calcule as somas
        this.seriesData.forEach(series => {
          series.data.forEach(item => {
            if (tempTotals[item.x]) {
              tempTotals[item.x] += item.y;
            } else {
              tempTotals[item.x] = item.y;
            }
          });
        });

        // Finalmente, converta o objeto de somas em um array
        this.totals = Object.keys(tempTotals).map(key => ({ x: key, y: tempTotals[key] }));
        this.seriesData.push({name: "TOTAL", data: this.totals})

        this.seriesData.reverse();
      }

      seriesData = [
        {
          name: "Filial 1",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 2",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 3",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 4",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 5",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 6",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 7",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 8",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 9",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 10",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 11",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 12",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 13",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 14",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 15",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 16",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 17",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 18",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 19",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 20",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 21",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 22",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Filial 23",
          data: this.generateData(11, {
            min: 0,
            max: 90
          })
        }
      ]

      constructor(private _tipovendaService: tipovendaService) {
        this.chartOptionsPie = {
            series: [28753623, 67023721, 30584983, 7394712, 103890089],
            chart: {
                width: 380,
                height: 400,
                type: 'donut',
            },
            labels: [
                'A Vista',
                '1 até 30 dias',
                '31 até 60 dias',
                '61 até 90 dias',
                'acima de 90 dias',
            ],
            responsive: [
                {
                    breakpoint: 1200,
                    options: {
                        chart: {
                            width: 200,
                            height: 420,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
            yaxis: {
                show: false,
                showAlways: true,
                labels: {
                    show: true,
                    formatter: (val) => {
                        return this.formatadorPts(val);
                    },
                },
            },
        };
        this.chartOptions1 = {
            series: [
                {
                    name: 'A Vista',
                    data: [4469171, 4240401, 3432654],
                    type: 'area',
                },
                {
                    name: '1 até 30 dias',
                    data: [10431883, 10227032, 7637004],
                    type: 'area',
                },
                {
                    name: '31 até 60 dias',
                    data: [4833369, 4330621, 3711817],
                    type: 'area',
                },
                {
                    name: '61 até 90 dias',
                    data: [1182992, 1071140, 851728],
                    type: 'area',
                },
                {
                    name: 'Acima de 90 dias',
                    data: [16924685, 15003348, 11554669],
                    type: 'area',
                },
                {
                    name: 'Total',
                    color: 'black',
                    data: [37842099, 34872542, 27187870],
                    type: 'line',
                },
            ],
            chart: {
                type: 'area',
                height: 220,
                width: '100%',
                stacked: false,
                toolbar: {
                    show: true,
                },
                zoom: {
                    enabled: true,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    opacityFrom: 0.3,
                    opacityTo: 0.5,
                    stops: [0, 100, 100, 100],
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            xaxis: {
                type: 'category',
                categories: ['Mai', 'Jun', 'Jul'],
            },
            dataLabels: {
                distributed: true,
                enabled: false,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold',
                    colors: ['black'],
                },
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.2,
                },
            },
            yaxis: {
                show: true,
                showAlways: false,
                labels: {
                    formatter: (val) => {
                        return this.formatadorUnidade(val);
                    },
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                x: {
                    format: 'dd MMM, yyyy',
                },
                y: {
                    formatter: function (value) {
                        if (!value) {
                            value = 0;
                        }
                        return value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        });
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
        };
        this.heatMap = {
          series: this.seriesData,
          chart: {
            width: "100%",
            height: 780,
            type: "heatmap",

          },
          legend: {
            show: false
          },
          stroke: {
            width: 0
          },
          plotOptions: {
            heatmap: {
              radius: 0,
              enableShades: false,
              colorScale: {
                ranges: [
                  {
                    from: -30,
                    to: 5,
                    color: "#00A100"
                  },
                  {
                    from: 6,
                    to: 20,
                    color: "#128FD9"
                  },
                  {
                    from: 21,
                    to: 45,
                    color: "#FFB200"
                  },
                  {
                    from: 46,
                    to: 55,
                    color: "#FF0000"
                  },
                  {from: 100,
                    to: 1000,
                    color: "black"
                  }
                ]
              }
            }
          },
          dataLabels: {
            enabled: true,
            style: {
              colors: ["#fff"]
            }
          },
          xaxis: {
            type: "category",
            position: "top",
            categories: ["1x","2x","3x","4x","5x","6x","7x","8x","9x","10x","12x"]
          },
          title: {
            text: "Totais por filiais - Parcelas"
          }
        };
    }
    public generateData(count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
          var x = (i + 1).toString();
          var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

          series.push({
            x: x,
            y: y
          });
          i++;
        }
        return series;
      }

    formatadorUnidade(val) {
        var numero = val ? Number(val).toFixed(0) : '0';
        var valor = numero;
        if (String(numero).length < 4) {
            valor = numero;
        } else {
            if (String(numero).length < 7) {
                valor =
                    numero.substring(0, 1) + ',' + numero.substring(1, 2) + 'K';
            } else {
                if (String(numero).length < 8) {
                    valor =
                        numero.substring(0, 1) +
                        ',' +
                        numero.substring(1, 2) +
                        'M';
                } else {
                    if (String(numero).length < 9) {
                        valor =
                            numero.substring(0, 2) +
                            ',' +
                            numero.substring(1, 2) +
                            'M';
                    } else {
                        if (String(numero).length < 10) {
                            valor =
                                numero.substring(0, 3) +
                                ',' +
                                numero.substring(1, 2) +
                                'M';
                        } else {
                            if (String(numero).length < 17) {
                                valor =
                                    numero.substring(0, 1) +
                                    ',' +
                                    numero.substring(1, 2) +
                                    'B';
                            }
                        }
                    }
                }
            }
        }
        return valor;
    }
    formatadorPts(val) {
        if (!val) {
            val = 0;
        }
        return val.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }
}
