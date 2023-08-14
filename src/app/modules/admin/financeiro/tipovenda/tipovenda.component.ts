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
import { ColorsComponent } from '../../util/colors/colors.component';

// export interface PeriodicElement {
//     name: string[];
//     position: number;
//     weight: number;
//     symbol: string;
//   }

// const ELEMENT_DATA: PeriodicElement[] = [
//     {position: 1, name: ['Hydrogen','ta'], weight: 1.0079, symbol: 'H'},
//   ];

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
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    // dataSource = ELEMENT_DATA;
    public trigger: number = 0;
    chartOptionsPie: ApexOptions;
    chartOptionsPie2: ApexOptions;
    chartOptions1: ApexOptions;
    chartOptions2: ApexOptions;
    chartOptionsMixed: ApexOptions;
    chartOptionsMixed2: ApexOptions;
    heatMap: ApexOptions;
    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('chartPie') chartPie: ChartComponent;
    @ViewChild('chart2') chart2: ChartComponent;
    @ViewChild('chartPie2') chartPie2: ChartComponent;
    @ViewChild('chartheat') chartheat: ChartComponent;
    @ViewChild('chartMixed') chartMixed: ChartComponent;
    @ViewChild('chartMixed2') chartMixed2: ChartComponent;
    titulo: string = 'Tipos de Vendas';
    subTitulo: string = 'Mensal e totais';
    isChecked: boolean;
    isToggleOn: boolean;
    today = new Date();
    totalPie1: any = 0;
    totalPie2: any = 0;
    series = { columns: [], rows: [] };
    series2 = { columns: [], rows: [] };
    series3 = { columns: [], rows: [] };
    series4 = { columns: [], rows: [] };
    seriesHeat = { columns: [], rows: [] };
    seriesMixed: any = [];
    seriesMixed2: any = [];
    seriesPie: any = [];
    seriesM1: any = [];
    seriesM2: any = [];
    labelsPie: any = [];
    seriesPie2: any = [];
    labelsPie2: any = [];
    seriesData: any = [];
    categories = [];
    categories2 = [];
    auxMes1: string;
    auxMes2: string;
    anos: any[];
    HeatFiliais: any[] = [];
    tiposBool: boolean[] = new Array(4).fill(true);
    PMVGeral: any = 0;
    PMVIndex: number = 0;
    tipos: any[];
    av: boolean = false;
    bol: boolean = false;
    cc: boolean = false;
    cd: boolean = false;

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
        ['Belém - 2', '2'],
        ['Cuiabá - 3', '3'],
        ['São Luis - 5', '5'],
        ['Teresina - 6', '6'],
        ['Salvador - 7', '7'],
        ['Fortaleza - 8', '8'],
        ['Natal - 9', '9'],
        ['Belo Horizonte - 10', '10'],
        ['João Pessoa - 11', '11'],
        ['Aracajú - 12', '12'],
        ['Sinop - 13', '13'],
        ['Marabá - 14', '14'],
        ['Campina Grande - 15', '15'],
        ['Juazeiro do Norte - 16', '16'],
        ['Imperatriz - 17', '17'],
        ['Macapá - 18', '18'],
        ['Vitória da Conq. - 19', '19'],
        ['Maceió - 20', '20'],
        ['Recife - 21', '21'],
        ['Goiânia - 22', '22'],
        ['Rio de Janeiro - 23', '23'],
        ['Juiz de Fora - 24', '24'],
        ['Centro de Dist-  - 25', '25'],
        ['Tailândia - 27', '27'],
        ['Cuiabá - EXP - 28', '28'],
    ];

    ngAfterViewInit() {
        this.limpar();
        this.SetGeral();
    }

    setFiltroHeat() {
        this._tipovendaService.getSeriesHeat().subscribe((dataresponse) => {
            this.seriesHeat.columns = dataresponse.columns;
            this.seriesHeat.rows = dataresponse.rows;
            this.setDataHeat();
        });
    }

    consultaHeat() {
        if (this.av) {
            this.tiposBool[0] = true;
        } else {
            this.tiposBool[0] = false;
        }
        if (this.bol) {
            this.tiposBool[1] = true;
        } else {
            this.tiposBool[1] = false;
        }
        if (this.cc) {
            this.tiposBool[2] = true;
        } else {
            this.tiposBool[2] = false;
        }
        if (this.cd) {
            this.tiposBool[3] = true;
        } else {
            this.tiposBool[3] = false;
        }
        if (!this.av && !this.bol && !this.cc && !this.cd) {
            for (let i = 0; i < this.tiposBool.length; i++) {
                this.tiposBool[i] = true;
            }
        }

        var tiposSelect: String[] = new Array();
        for (let i2 = 0; i2 < this.tiposBool.length; i2++) {
            if (this.tiposBool[i2]) {
                tiposSelect.push(this.tipos[i2]);
            }
        }
        this._tipovendaService.setTipos(tiposSelect);
        this.limparHeat(); // viewSerie, categorias, series
        this.setFiltroHeat();
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

        this._tipovendaService.getSeriesMixed().subscribe((dataresponse) => {
            this.setDataMixed(dataresponse.rows);
        });
        this._tipovendaService.getSeriesMixed2().subscribe((dataresponse) => {
            this.setDataMixed2(dataresponse.rows);
        });
    }

    setDataHeat() {
        var PMV = 0;
        var auxMedia = 0;
        var filial: String;
        var nextExpected = 0;
        // Atualiza o valor esperado para o próximo
        var aux = 0;
        while (aux < this.seriesHeat.rows.length) {
            var auxArray;
            if (aux === 0) {
                auxArray = 0;
            } else {
                auxArray = aux - 1;
            }

            if (
                this.seriesHeat.rows[aux][0] !=
                this.seriesHeat.rows[auxArray][0]
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

                this.HeatFiliais.push(this.seriesHeat.rows[aux - 1][5]);
                this.HeatFiliais.push(String(this.seriesHeat.rows[aux - 1][7]));
                this.HeatFiliais.push(String(this.seriesHeat.rows[aux - 1][6]));
                PMV += this.seriesHeat.rows[aux - 1][6];
                auxMedia++;
                this.seriesData.push({ name: filial, data: this.HeatFiliais });
                // this.HeatFiliais.push(this.seriesHeat.rows[aux - 1][3]);
                // this.HeatFiliais.push(this.seriesHeat.rows[aux - 1][4]);
                this.HeatFiliais = [];

                // Reinicia o valor esperado para a próxima filial e adiciona a primeira parcela da nova filial

                nextExpected = this.seriesHeat.rows[aux][1] + 1;
                if (nextExpected != 1) {
                    this.HeatFiliais.push(0);
                }
                this.HeatFiliais.push(this.seriesHeat.rows[aux][2]);
            } else if (
                this.seriesHeat.rows[aux][0] ==
                this.seriesHeat.rows[auxArray][0]
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
        // this.HeatFiliais.push(this.seriesHeat.rows[aux - 1][3]);
        // this.HeatFiliais.push(this.seriesHeat.rows[aux - 1][4]);
        this.HeatFiliais.push(this.seriesHeat.rows[aux - 1][5]);
        this.HeatFiliais.push(String(this.seriesHeat.rows[aux - 1][7]));
        this.HeatFiliais.push(String(this.seriesHeat.rows[aux - 1][6]));
        PMV += this.seriesHeat.rows[aux - 1][6];
        auxMedia++;
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

        // Inicie cada total como 0.
        let totals = new Array(17).fill(0);

        for (let series of this.seriesData) {
            for (let index = 0; index < series.data.length ; index++) {
                totals[index] += series.data[index];
            }
        }
        totals[16] = PMV / auxMedia;

        let totalSeries = {
            name: 'TOTAL',
            data: totals,
        };
        this.seriesData.push(totalSeries);
        this.seriesData.reverse();
        this.heatMap.series = this.seriesData;
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
        this.chartOptionsPie.series = this.seriesPie;
        this.chartOptionsPie.labels = this.labelsPie;
        var reflow = new ApexCharts(this.chartPie, this.chartOptionsPie);
    }
    setDataM1() {
        this.seriesM1 = this.seriesM1.concat({ name: 'Total', data: [] });

        for (
            let index = 0, indexdata = 0;
            index < this.series2.rows.length;
            indexdata++
        ) {
            let total = 0;
            for (let index1 = 0; index1 < 6; index1++, index++) {
                if (index < 6) {
                    if (this.series2.rows[index][1] === 'A vista') {
                        this.seriesM1[index1].name = 'Até 1 dia';
                    } else {
                        this.seriesM1[index1].name =
                            this.series2.rows[index][1];
                    }
                }
                let value = this.series2.rows[index][2];
                if (this.series2.rows[index][1] === 'PMV') {
                    this.PMVGeral += this.series2.rows[index][2];
                    this.PMVIndex++;
                } else {
                    total += value;
                }
                this.seriesM1[index1].data.push(value);
            }
            this.seriesM1[this.seriesM1.length - 1].data.push(total);
            this.auxMes1 = this.series2.rows[index - 1][0];
            for (let aux = 0; aux < this.meses.length; aux++) {
                if (this.meses[aux][1] === this.auxMes1.substring(0, 2)) {
                    this.categories[indexdata] =
                        this.meses[aux][0] + '/' + this.auxMes1.slice(5);
                    break;
                }
            }
        }

        this.chartOptions1.series = this.seriesM1;
        this.chartOptions1.xaxis.categories = this.categories;
        if (this.categories.length === 1) {
            this.chartOptions1.chart.type = 'bar';
            this.chartOptions1.dataLabels.offsetY = -20;
            this.chartOptions1.dataLabels.enabled = true;
        }else{
            this.chartOptions1.chart.type = 'area';
            this.chartOptions1.dataLabels.offsetY = 0;
            this.chartOptions1.dataLabels.enabled = false;
        }
        this.PMVGeral = this.formatadorPtsPMV(this.PMVGeral / this.PMVIndex);
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
        this.seriesM2 = this.seriesM2.concat({
            name: 'Total',
            type: '',
            data: [],
        });
        for (
            let index = 0, indexdata = 0;
            index < this.series4.rows.length;
            indexdata++
        ) {
            let total = 0;
            for (let index1 = 0; index1 < 4; index1++, index++) {
                if (index < 4)
                    this.seriesM2[index1].name = this.series4.rows[index][1];
                let value = this.series4.rows[index][2];
                this.seriesM2[index1].data.push(value);
                total += value;
            }
            this.seriesM2[this.seriesM2.length - 1].data.push(total);
            this.auxMes2 = this.series4.rows[index - 1][0];
            for (let aux = 0; aux < this.meses.length; aux++) {
                if (this.meses[aux][1] === this.auxMes2.substring(0, 2)) {
                    this.categories2[indexdata] =
                        this.meses[aux][0] + '/' + this.auxMes2.slice(5);
                    break;
                }
            }
        }
        this.chartOptions2.series = this.seriesM2;
        this.chartOptions2.xaxis.categories = this.categories2;
        if (this.categories2.length === 1) {
            this.chartOptions2.chart.type = 'bar';
            this.chartOptions2.dataLabels.offsetY = -20;
            this.chartOptions2.dataLabels.enabled = true;
        }else{
            this.chartOptions2.chart.type = 'area';
            this.chartOptions2.dataLabels.offsetY = 0;
            this.chartOptions2.dataLabels.enabled = false;
        }

        var reflow = new ApexCharts(this.chart2, this.chartOptions2);
    }

    setDataMixed(dataRow) {
        let rawData: { [type: string]: { [year: number]: number } } = {};
        let types = new Set<string>();

        for (let row of dataRow) {
            let [date, type, value] = row;
            if (type === 'A vista') type = 'À vista';
            let [month, year] = date.split('/').map((part) => parseInt(part));

            if (!rawData[type]) rawData[type] = {};
            if (!rawData[type][year]) rawData[type][year] = 0;

            // Incrementa o valor para o tipo/ano específico
            rawData[type][year] += parseFloat(value);

            types.add(type);
        }

        this.seriesMixed = [];
        var sysdate = new Date();
        var years = Array.from(
            { length: 3 },
            (_, i) => sysdate.getFullYear() - i
        ).reverse();

        for (let type of types) {
            let dataForType = [];
            for (let year of years) {
                dataForType.push(rawData[type][year] || 0);
            }
            this.seriesMixed.push({
                name: type,
                data: dataForType,
            });
        }

        this.chartOptionsMixed.xaxis.categories = years.map((y) =>
            y.toString()
        );
        this.chartOptionsMixed.series = this.seriesMixed;
        var chartMixed = new ApexCharts(
            this.chartMixed,
            this.chartOptionsMixed
        );
    }

    setDataMixed2(dataRow) {
        let rawData: { [type: string]: { [year: number]: number } } = {};
        let types = new Set<string>();

        for (let row of dataRow) {
            let [date, type, value] = row;
            let [month, year] = date.split('/').map((part) => parseInt(part));

            if (!rawData[type]) rawData[type] = {};
            if (!rawData[type][year]) rawData[type][year] = 0;

            // Incrementa o valor para o tipo/ano específico
            rawData[type][year] += parseFloat(value);

            types.add(type);
        }

        this.seriesMixed2 = [];
        var sysdate = new Date();
        var years = Array.from(
            { length: 3 },
            (_, i) => sysdate.getFullYear() - i
        ).reverse();

        for (let type of types) {
            let dataForType = [];
            for (let year of years) {
                dataForType.push(rawData[type][year] || 0);
            }
            this.seriesMixed2.push({
                name: type,
                data: dataForType,
            });
        }

        this.chartOptionsMixed2.xaxis.categories = years.map((y) =>
            y.toString()
        );
        this.chartOptionsMixed2.series = this.seriesMixed2;
        var chartMixed = new ApexCharts(
            this.chartMixed2,
            this.chartOptionsMixed2
        );
    }

    limparHeat() {
        this.HeatFiliais = [];
        this.seriesHeat = { columns: [], rows: [] };
        this.seriesData = [];
    }

    limpar() {
        this.PMVGeral = 0;
        this.PMVIndex = 0;
        this.chartOptions2.chart.type = 'area';
        this.chartOptions1.chart.type = 'area';
        this.tipos = ['1,10', '2,3', '7', '8'];
        this.anos = [];
        this.HeatFiliais = [];
        this.series = { columns: [], rows: [] };
        this.totalPie1 = 0;
        this.totalPie2 = 0;
        this.series2 = { columns: [], rows: [] };
        this.series3 = { columns: [], rows: [] };
        this.series4 = { columns: [], rows: [] };
        this.seriesHeat = { columns: [], rows: [] };
        this.seriesData = [];
        this.seriesMixed = [];
        this.seriesMixed2 = [];
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
        ];

        this.categories = new Array();
        this.categories2 = new Array();
    }

    consultavendafilial(filial, dtini, dtfin) {
        this.trigger++;
        if (filial.length == 1) {
            if (filial[0] == 'null') {
                filial = 99;
            }
        }
        this._tipovendaService.setParam(dtini, dtfin, filial, 'REDE');
        this.limpar(); // viewSerie, categorias, series
        this.SetGeral();
    }

    constructor(
        private _tipovendaService: tipovendaService,
        private _colors: ColorsComponent
    ) {
        this.chartOptionsMixed = {
            series: this.seriesMixed,
            colors: this._colors.colors,
            chart: {
                type: 'bar',
                height: 440,
                width: '100%',
                stacked: false,
            },
            dataLabels: {
                offsetY: -20,
                enabled: true,
                formatter: (val) => {
                    return this.formatadorUnidade(val);
                },
                style: {
                    colors: ['#000000'],
                },
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: 'top',
                    },
                    horizontal: false, // ou true, dependendo da orientação das barras // ajustar conforme necessário
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            title: {
                text: 'Anos anteriores',
                align: 'left',
                offsetX: 110,
            },
            xaxis: {
                // categories: ['2021','2022','2023'], // Este array deve conter os nomes dos meses
                type: 'category', // Força o eixo X a ser tratado como categorias
            },
            yaxis: {
                show: true,
                showAlways: true,
                labels: {
                    show: true,
                    formatter: (val) => {
                        return this.formatadorPts(val);
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
                horizontalAlign: 'left',
                position: 'top',
                offsetX: 40,
            },
        };
        this.chartOptionsMixed2 = {
            series: this.seriesMixed,
            colors: this._colors.colors,
            chart: {
                type: 'bar',
                height: 440,
                width: '100%',
                stacked: false,
            },
            dataLabels: {
                offsetY: -20,
                enabled: true,
                formatter: (val) => {
                    return this.formatadorUnidade(val);
                },
                style: {
                    colors: ['#000000'],
                },
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: 'top',
                    },
                    horizontal: false, // ou true, dependendo da orientação das barras // ajustar conforme necessário
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            title: {
                text: 'Anos anteriores',
                align: 'left',
                offsetX: 110,
            },
            xaxis: {
                // categories: ['2021','2022','2023'], // Este array deve conter os nomes dos meses
                type: 'category', // Força o eixo X a ser tratado como categorias
            },
            yaxis: {
                show: true,
                showAlways: true,
                labels: {
                    show: true,
                    formatter: (val) => {
                        return this.formatadorPts(val);
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
                horizontalAlign: 'left',
                position: 'top',
                offsetX: 40,
            },
        };

        this.chartOptionsPie = {
            series: this.seriesPie,
            colors: this._colors.colors,
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
            colors: this._colors.colors,
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
                    dataLabels: {
                        position: 'top',
                    },
                    horizontal: false, // ou true, dependendo da orientação das barras // ajustar conforme necessário
                },
            },
            xaxis: {
                type: 'category',
                categories: this.categories,
            },
            dataLabels: {
                distributed: true,
                enabled: false,
                formatter: (val) => {
                    return this.formatadorUnidade(val);
                },
                style: {
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold',
                    colors: ['black'],
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
                        if (val < 0 || val > 150) {
                            return this.formatadorPts(val);
                        } else if (val != 0) {
                            return this.formatadorPtsPMV(val);
                        } else {
                            return val;
                        }
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
        };

        this.chartOptionsPie2 = {
            series: this.seriesPie2,
            colors: this._colors.colors,
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
            colors: this._colors.colors,
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
                    dataLabels: {
                        position: 'top',
                    },
                    horizontal: false, // ou true, dependendo da orientação das barras // ajustar conforme necessário
                },
            },
            xaxis: {
                type: 'category',
                categories: this.categories2,
            },
            dataLabels: {
                distributed: true,
                enabled: false,
                formatter: (val) => {
                    return this.formatadorUnidade(val);
                },
                style: {
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold',
                    colors: ['black'],
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
                    show: true,
                    format: 'dd MMM, yyyy',
                },
                y: {
                    formatter: (val) => {
                        if (val < 0 || val > 150) {
                            return this.formatadorPts(val);
                        } else if (val != 0) {
                            return this.formatadorPtsPMV(val);
                        } else {
                            return val;
                        }
                    },
                },
            },
            stroke: {
                width: 0.1,
            },
            colors: ['#ed7b00', '#6e7a8a'],
            plotOptions: {
                heatmap: {
                    radius: 0,
                    enableShades: false,
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '10px',
                    colors: ['#000000', '#ffffff'],
                },
                formatter: (val) => {
                    if (Number(val) < 0 || Number(val) > 150) {
                        return this.formatadorUnidade(val);
                    } else if (val != 0) {
                        return this.formatadorPtsPMV(val);
                    } else {
                        return val;
                    }
                },
            },
            xaxis: {
                type: 'category',
                position: 'top',
                labels: {
                    rotate: 0,
                    style: {
                        fontSize: '10px',
                        cssClass: 'overflow',
                    },
                },
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
                    '12x+',
                    'FIN',
                    'ROL',
                    'DESC',
                    'PMV'
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

        if (val >= 0) {
            if (String(numero).length < 4) {
                valor = numero;
            } else {
                if (String(numero).length < 5) {
                    valor =
                        numero.substring(0, 1) +
                        ',' +
                        numero.substring(1, 2) +
                        'K';
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
        } else {
            if (String(numero).length < 4) {
                valor = numero;
            } else {
                if (String(numero).length - 1 < 5) {
                    valor =
                        numero.substring(0, 2) +
                        ',' +
                        numero.substring(2, 3) +
                        'K';
                } else {
                    if (String(numero).length - 1 < 6) {
                        valor =
                            numero.substring(0, 3) +
                            ',' +
                            numero.substring(3, 4) +
                            'K';
                    } else {
                        if (String(numero).length - 1 < 7) {
                            valor =
                                numero.substring(0, 4) +
                                ',' +
                                numero.substring(5, 5) +
                                'K';
                        } else {
                            if (String(numero).length - 1 < 8) {
                                valor =
                                    numero.substring(0, 2) +
                                    ',' +
                                    numero.substring(2, 3) +
                                    'M';
                            } else {
                                if (String(numero).length - 1 < 9) {
                                    valor =
                                        numero.substring(0, 3) +
                                        ',' +
                                        numero.substring(3, 4) +
                                        'M';
                                } else {
                                    if (String(numero).length - 1 < 10) {
                                        valor =
                                            numero.substring(0, 4) +
                                            ',' +
                                            numero.substring(4, 5) +
                                            'M';
                                    } else {
                                        if (String(numero).length - 1 < 17) {
                                            valor =
                                                numero.substring(0, 2) +
                                                ',' +
                                                numero.substring(2, 3) +
                                                'B';
                                        }
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
            return String(
                val.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })
            ).slice(0, -3);
        }
        return val;
    }
    formatadorPtsPMV(val) {
        if (isNumber(val)) {
            if (!val) {
                val = 0;
            }
            return String(
                val.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })
            ).slice(3);
        }
        return val;
    }
}
