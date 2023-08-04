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
import _, { isNumber } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { categories } from '../../../../mock-api/apps/ecommerce/inventory/data';
import { items } from 'app/mock-api/apps/file-manager/data';

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
    @ViewChild('chartheat') chartheat: ChartComponent;
    datasource = this._tipovendaService.ELEMENT_DATA;
    titulo: string = 'Tipos de Vendas';
    subTitulo: string = 'Mensal e totais';
    isToggleOn: boolean;
    _serviceChart: any;
    totalPie1: any = 0;
    totalPie2: any = 0;
    totals = [];
    series = { columns: [], rows: [] };
    series2 = { columns: [], rows: [] };
    series3 = { columns: [], rows: [] };
    series4 = { columns: [], rows: [] };
    seriesHeat = { columns: [], rows: [] };
    seriesPie: any = [];
    labelsPie: any = [];
    seriesPie2: any = [];
    labelsPie2: any = [];
    seriesData: any = [];
    categories = [];
    categories2 = [];
    auxMes1: string;
    auxMes2: string;
    HeatFiliais: any[] = [];
    param = {
        filial: null,
        descFilial: null,
    };
    parcelas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

    filiais = [
        ['Belém .2', '2'],
        ['Cuiabá .3', '3'],
        ['São Luis .5', '5'],
        ['Teresina .6', '6'],
        ['Salvador .7', '7'],
        ['Fortaleza .8', '8'],
        ['Natal .9', '9'],
        ['Belo Horizonte .10', '10'],
        ['João Pessoa .11', '11'],
        ['Aracajú .12', '12'],
        ['Sinop .13', '13'],
        ['Marabá .14', '14'],
        ['Campina Grande .15', '15'],
        ['Juazeiro do Norte .16', '16'],
        ['Imperatriz .17', '17'],
        ['Macapá .18', '18'],
        ['Vitória da Conq. .19', '19'],
        ['Maceió .20', '20'],
        ['Recife .21', '21'],
        ['Goiânia .22', '22'],
        ['Rio de Janeiro .23', '23'],
        ['Juiz de Fora .24', '24'],
        ['Centro de Dist. .25', '25'],
        ['Tailândia .27', '27'],
        ['Cuiabá - EXP .28', '28'],
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

    ngAfterViewInit() {
        this.limpar();
        this.SetGeral();
    }

    SetGeral() {
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
        this._tipovendaService.getSeriesHeat().subscribe((dataresponse) => {
            this.seriesHeat.columns = dataresponse.columns;
            this.seriesHeat.rows = dataresponse.rows;
            this.setDataHeat();
        });
    }

    setDataHeat() {
        var filial: String;
        var nextExpected = 1; // Inicia o esperado em 1
        this.HeatFiliais.push(this.seriesHeat.rows[0][2]);
        nextExpected = this.seriesHeat.rows[0][1] + 1; // Atualiza o valor esperado para o próximo
        var aux = 1;
        while (aux < this.seriesHeat.rows.length) {
            // Ajusta a condição do loop para evitar acessar um índice não existente
            if (
                aux > 0 &&
                this.seriesHeat.rows[aux][0] != this.seriesHeat.rows[aux - 1][0]
            ) {
                // Preenche o resto com zeros até 12
                while (nextExpected <= 12) {
                    this.HeatFiliais.push(0);
                    nextExpected++;
                }

                for (let aux2 = 0; aux2 < this.filiais.length; aux2++) {
                    if (
                        this.filiais[aux2][1] ==
                        this.seriesHeat.rows[aux - 1][0]
                    ) {
                        filial = this.filiais[aux2][0];
                        break;
                    }
                }

                this.seriesData.push({ name: filial, data: this.HeatFiliais });
                this.HeatFiliais = [];

                // Reinicia o valor esperado para a próxima filial e adiciona a primeira parcela da nova filial
                this.HeatFiliais.push(this.seriesHeat.rows[aux][2]);
                nextExpected = this.seriesHeat.rows[aux][1] + 1;
            } else if (
                this.seriesHeat.rows[aux][0] == this.seriesHeat.rows[aux - 1][0]
            ) {
                // Verifica se a parcela atual é a esperada
                while (
                    this.seriesHeat.rows[aux][1] > nextExpected &&
                    nextExpected <= 12
                ) {
                    this.HeatFiliais.push(0);
                    nextExpected++;
                }
                this.HeatFiliais.push(this.seriesHeat.rows[aux][2]);
                nextExpected = this.seriesHeat.rows[aux][1] + 1;
            }
            aux++;
        }

        // Preenche o resto com zeros até 12 para a última filial
        while (nextExpected <= 12) {
            this.HeatFiliais.push(0);
            nextExpected++;
        }

        for (let aux2 = 0; aux2 < this.filiais.length; aux2++) {
            if (this.filiais[aux2][1] == this.seriesHeat.rows[aux - 1][0]) {
                filial = this.filiais[aux2][0];
                break;
            }
        }

        this.seriesData.push({ name: filial, data: this.HeatFiliais });

        // Primeiro, inicialize um array para armazenar os totais de cada parcela.
        // Inicie cada total como 0.
        let totals = new Array(14).fill(0);

        // Em seguida, faça um loop através do conjunto de dados e some os valores de cada parcela.
        for (let series of this.seriesData) {
            for (let index = 0; index < series.data.length; index++) {
                totals[index] += series.data[index];
            }
        }

        // Depois disso, crie uma nova série com os totais e adicione-a ao conjunto de dados.
        let totalSeries = {
            name: 'TOTAL',
            data: totals,
        };
        this.seriesData.push(totalSeries);
        this.seriesData.reverse();
        this.heatMap.series = this.seriesData;
        console.log(this.heatMap.series);
    }

    setDataPie() {
        for (let index = 0; index < this.series.rows.length; index++) {
            this.seriesPie[index] = this.series.rows[index][1];
            this.totalPie1 += this.series.rows[index][1];
        }
        for (let index = 0; index < this.series.rows.length; index++) {
            if (this.series.rows[index][0] === 'A vista') {
                this.labelsPie[index] = 'Até 1 dia';
            } else {
                this.labelsPie[index] = this.series.rows[index][0];
            }
        }
        this.totalPie1 = this.formatadorPts(this.totalPie1);
        console.log(this.totalPie1);
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
                if (index < 5) {
                    if (this.series2.rows[index][1] === 'A vista') {
                        this.seriesM1[index1].name = 'Até 1 dia';
                    } else {
                        this.seriesM1[index1].name =
                            this.series2.rows[index][1];
                    }
                }
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
            this.totalPie2 += this.series3.rows[index][1];
        }
        for (let index = 0; index < this.series3.rows.length; index++) {
            this.labelsPie2[index] = this.series3.rows[index][0];
        }
        this.totalPie2 = this.formatadorPts(this.totalPie2);
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

    limpar() {
        this.HeatFiliais = [];
        this.series = { columns: [], rows: [] };
        this.totalPie1 = 0;
        this.totalPie2 = 0;
        this.series2 = { columns: [], rows: [] };
        this.series3 = { columns: [], rows: [] };
        this.series4 = { columns: [], rows: [] };
        this.seriesHeat = { columns: [], rows: [] };
        this.seriesData = [];
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
    validaParam() {
        this.param.filial = this._tipovendaService.param.filial;
        this.param.descFilial = this._tipovendaService.param.descFilial;
    }

    consultavendafilial(filial) {
        if (filial.length == 1) {
            if (filial[0] == 'null') {
                filial = 99;
            }
        }
        this._tipovendaService.setParam(filial, 'REDE');
        this.limpar(); // viewSerie, categorias, series
        this.validaParam();
        this.SetGeral();
    }

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
                type: 'heatmap',
            },
            legend: {
                show: false,
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
            stroke: {
                width: 0.1,
            },
            plotOptions: {
                heatmap: {
                    radius: 0,
                    enableShades: false,
                    colorScale: {
                        ranges: [
                            {
                                from: 0,
                                to: 0,
                                color: '#c3c3c3',
                            },
                            {
                                from: 1,
                                to: 100000,
                                color: '#ff0000',
                            },
                            {
                                from: 100001,
                                to: 200000,
                                color: '#ff3300',
                            },
                            {
                                from: 200001,
                                to: 300000,
                                color: '#ff6600',
                            },
                            {
                                from: 300001,
                                to: 400000,
                                color: '#ff9900',
                            },
                            {
                                from: 400001,
                                to: 500000,
                                color: '#ffcc00',
                            },
                            {
                                from: 500001,
                                to: 600000,
                                color: '#ffff00',
                            },
                            {
                                from: 600001,
                                to: 700000,
                                color: '#ccff00',
                            },
                            {
                                from: 700001,
                                to: 800000,
                                color: '#99ff00',
                            },
                            {
                                from: 800001,
                                to: 900000,
                                color: '#66ff00',
                            },
                            {
                                from: 900001,
                                to: 1000000,
                                color: '#33ff00',
                            },
                            {
                                from: 1000001,
                                to: 99999999999,
                                color: '#00ff00',
                            },
                        ],
                    },



                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#fff'],
                },
                formatter: (val) => {
                    return this.formatadorUnidade(val);
                },
            },
            xaxis: {
                type: 'category',
                position: 'top',
                categories: [
                    'A Vista',
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
                    '11x',
                    '12x',
                    'TOTAL',
                ],
            },
            yaxis: {
                show: true,
                showAlways: false,
                labels: {
                    show: true,
                    formatter: (val) => {
                        return this.formatadorPts(val);
                    },
                },
            },
        };
    }
    formatadorUnidade(val) {
        var numero = val ? Number(val).toFixed(0) : '0';
        var valor = numero;
        if (String(numero).length < 4) {
            valor = numero;
        } else {
            if (String(numero).length < 5) {
                valor =
                    numero.substring(0, 1) + ',' + numero.substring(1, 2) + 'K';
            } else {
                if (String(numero).length < 6) {
                    valor =
                        numero.substring(0, 2) +
                        ',' +
                        numero.substring(2, 3) +
                        'K';
                } else {
                    if (String(numero).length < 7) {
                        valor =
                            numero.substring(0, 3) +
                            ',' +
                            numero.substring(3, 4) +
                            'K';
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
                                    numero.substring(2, 3) +
                                    'M';
                            } else {
                                if (String(numero).length < 10) {
                                    valor =
                                        numero.substring(0, 3) +
                                        ',' +
                                        numero.substring(3, 4) +
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
            }
        }
        return valor;
    }
    formatadorPts(val) {
        if (isNumber(val)) {
            if (!val) {
                val = 0;
            }
            return val.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
        }
        return val;
    }
}
