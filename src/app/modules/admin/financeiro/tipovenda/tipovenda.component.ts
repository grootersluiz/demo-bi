import { AuthService } from '../../../../core/auth/auth.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { tipovendaService } from './tipovenda.service';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { categories } from '../../../../mock-api/apps/ecommerce/inventory/data';

@Component({
    selector: 'tipovenda',
    templateUrl: './tipovenda.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: [
        './tipovenda.component.scss',
        '../../util/css/css.component.scss',
    ],
})
export class tipovendaComponent implements AfterViewInit {
    chartOptionsPie: ApexOptions;
    chartOptionsPie2: ApexOptions;
    chartOptions1: ApexOptions;
    chartOptions2: ApexOptions;
    heatMap: ApexOptions;
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('chartPie') chartPie: ChartComponent;
    @ViewChild('chart2') chart2: ChartComponent;
    @ViewChild('chartPie2') chartPie2: ChartComponent;
    datasource = this._tipovendaService.ELEMENT_DATA;
    titulo: string = 'Financeiro';
    subTitulo: string = '';
    isToggleOn: boolean;
    _serviceChart: any;
    totals = [];
    series = { columns: [], rows: [] };
    series2 = { columns: [], rows: [] };
    series3 = { columns: [], rows: [] };
    series4 = { columns: [], rows: [] };
    seriesPie: any = [];
    labelsPie: any = [];
    seriesPie2: any = [];
    labelsPie2: any = [];
    categories = [];
    categories2 = [];
    auxMes1: string;
    auxMes2: string;

    param = {
        mes: null,
        ano: null,
        ultDia:null,
        filial:null,
        descFilial: null,
        marca: null
      };

    meses = [
        ['Jan', '01'],
        ['Fev', '02'],
        ['Mar', '03'],
        ['Abr', '04'],
        ['Mai', '05'],
        ['Jun', '06'],
        ['Jul', '07'],
        ['Ago', '08'],
        ['Set', '09'],
        ['Out', '10'],
        ['Nov', '11'],
        ['Dez', '12'],
    ];

    seriesM1 = [
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
    ];
    seriesM2 = [
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
        {
            name: '',
            data: [],
        },
    ];

    SetGeral(){
        this._tipovendaService.getSeriesPie().subscribe((dataresponse) => {
            this.series.columns = dataresponse.columns;
            this.series.rows = dataresponse.rows;
            this.setDataPie();
        });
        this._tipovendaService.getSeriesM1().subscribe((dataresponse) => {
            this.series2.columns = dataresponse.columns;
            this.series2.rows = dataresponse.rows;
            this.setDataM1();
        });
        this._tipovendaService.getSeriesPie2().subscribe((dataresponse) => {
            this.series3.columns = dataresponse.columns;
            this.series3.rows = dataresponse.rows;
            this.setDataPie2();
        });
        this._tipovendaService.getSeriesM2().subscribe((dataresponse) => {
            this.series4.columns = dataresponse.columns;
            this.series4.rows = dataresponse.rows;
            this.setDataM2();
        });
    }
    ngAfterViewInit() {
        this.SetGeral();
        // Primeiro, crie um objeto para armazenar as somas temporárias
        const tempTotals = {};

        // Em seguida, calcule as somas
        this.seriesData.forEach((series) => {
            series.data.forEach((item) => {
                if (tempTotals[item.x]) {
                    tempTotals[item.x] += item.y;
                } else {
                    tempTotals[item.x] = item.y;
                }
            });
        });

        // Finalmente, converta o objeto de somas em um array
        this.totals = Object.keys(tempTotals).map((key) => ({
            x: key,
            y: tempTotals[key],
        }));
        this.seriesData.push({ name: 'TOTAL', data: this.totals });

        this.seriesData.reverse();
    }

    setDataPie() {
        for (let index = 0; index < this.series.rows.length; index++) {
            this.seriesPie[index] = this.series.rows[index][1];
        }
        for (let index = 0; index < this.series.rows.length; index++) {
            this.labelsPie[index] = this.series.rows[index][0];
        }
        this.chartOptionsPie.series = this.seriesPie;
        this.chartOptionsPie.labels = this.labelsPie;
        var reflow = new ApexCharts(this.chartPie, this.chartOptionsPie);
    }
    setDataM1() {
        for (
            let index = 0, indexdata = 0;
            index < this.series2.rows.length;
            indexdata++
        ) {
            for (let index1 = 0; index1 < 5; index1++, index++) {
                if (index < 5)
                    this.seriesM1[index1].name = this.series2.rows[index][1];
                this.seriesM1[index1].data.push(this.series2.rows[index][2]);
            }
            this.auxMes1 = this.series2.rows[index - 1][0];
            for (let aux = 0; aux < this.meses.length; aux++) {
                if (this.meses[aux][1] === this.auxMes1.substring(0, 2)) {
                    this.categories[indexdata] = this.meses[aux][0];
                    break;
                }
            }
        }
        this.chartOptions1.series = this.seriesM1;
        this.chartOptions1.xaxis.categories = this.categories;
        var reflow = new ApexCharts(this.chart, this.chartOptions1);
    }

    setDataPie2() {
        for (let index = 0; index < this.series3.rows.length; index++) {
            this.seriesPie2[index] = this.series3.rows[index][1];
        }
        for (let index = 0; index < this.series3.rows.length; index++) {
            this.labelsPie2[index] = this.series3.rows[index][0];
        }
        this.chartOptionsPie2.series = this.seriesPie2;
        this.chartOptionsPie2.labels = this.labelsPie2;

        var reflow = new ApexCharts(this.chartPie2, this.chartOptionsPie2);
    }
    setDataM2() {
        for (
            let index = 0, indexdata = 0;
            index < this.series4.rows.length;
            indexdata++
        ) {
            for (let index1 = 0; index1 < 5; index1++, index++) {
                if (index < 5)
                    this.seriesM2[index1].name = this.series4.rows[index][1];
                this.seriesM2[index1].data.push(this.series4.rows[index][2]);
            }
            this.auxMes2 = this.series4.rows[index - 1][0];
            for (let aux = 0; aux < this.meses.length; aux++) {
                if (this.meses[aux][1] === this.auxMes2.substring(0, 2)) {
                    this.categories2[indexdata] = this.meses[aux][0];
                    break;
                }
            }
        }
        this.chartOptions2.series = this.seriesM2;
        this.chartOptions2.xaxis.categories = this.categories2;

        var reflow = new ApexCharts(this.chart2, this.chartOptions2);
    }

    limpar(){
        this.series = {columns: [], rows: []};
        this.series2 = {columns: [], rows: []};
        this.series3 = {columns: [], rows: []};
        this.series4 = {columns: [], rows: []};
        this.seriesM1 = [
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
        ];
        this.seriesM2 = [
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
            {
                name: '',
                data: [],
            },
        ];
        this.categories = new Array();
        this.categories2 = new Array();

      }
      validaParam(){

        this.param.filial     = this._tipovendaService.param.filial;
        this.param.descFilial = this._tipovendaService.param.descFilial;
      }
    consultavendafilial(filial){
        if(filial.length == 1){
            if (filial[0]=='null'){
                filial = 99;
            }
        }
        this._tipovendaService.setParam(filial,'REDE');
        this.limpar(); // viewSerie, categorias, series
        this.validaParam();
        this.SetGeral();

      }
    seriesData = [
        {
            name: 'Filial 1',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 2',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 3',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 4',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 5',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 6',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 7',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 8',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 9',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 10',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 11',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 12',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 13',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 14',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 15',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 16',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 17',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 18',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 19',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 20',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 21',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 22',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Filial 23',
            data: this.generateData(11, {
                min: 0,
                max: 90,
            }),
        },
    ];

    constructor(
        private _tipovendaService: tipovendaService,
        private _httpClient: HttpClient,
        private cdr: ChangeDetectorRef
    ) {
        this.chartOptionsPie = {
            series: this.seriesPie,
            chart: {
                width: 380,
                height: 400,
                type: 'donut',
            },
            labels: this.labelsPie,
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
            series: this.seriesM1,
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
                categories: this.categories,
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
                    formatter: (val) => {
                        return this.formatadorPts(val);
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
        };

        this.chartOptionsPie2 = {
            series: this.seriesPie2,
            chart: {
                width: 380,
                height: 400,
                type: 'donut',
            },
            labels: this.labelsPie2,
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

        this.chartOptions2 = {
            series: this.seriesM2,
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
                categories: this.categories2,
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
                    formatter: (val) => {
                        return this.formatadorPts(val);
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
                width: '100%',
                height: 780,
                type: 'heatmap',
            },
            legend: {
                show: false,
            },
            stroke: {
                width: 0,
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
                                color: '#00A100',
                            },
                            {
                                from: 6,
                                to: 20,
                                color: '#128FD9',
                            },
                            {
                                from: 21,
                                to: 45,
                                color: '#FFB200',
                            },
                            {
                                from: 46,
                                to: 55,
                                color: '#FF0000',
                            },
                            { from: 100, to: 1000, color: 'black' },
                        ],
                    },
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#fff'],
                },
            },
            xaxis: {
                type: 'category',
                position: 'top',
                categories: [
                    '1x',
                    '2x',
                    '3x',
                    '4x',
                    '5x',
                    '6x',
                    '7x',
                    '8x',
                    '9x',
                    '10x',
                    '12x',
                ],
            },
            title: {
                text: 'Totais por filiais - Parcelas',
            },
        };
    }
    public generateData(count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = (i + 1).toString();
            var y = 11;

            series.push({
                x: x,
                y: y,
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
