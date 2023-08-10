import { LiveAnnouncer } from "@angular/cdk/a11y";
import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ViewChild, Inject, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';




import {
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexChart,
    ApexFill,
    ApexAxisChartSeries,
    ChartComponent,
    ApexDataLabels,
    ApexYAxis,
    ApexAnnotations,
    ApexStroke,
    ApexGrid,
    ApexResponsive,
    ApexOptions,


} from "ng-apexcharts";
import { FilterDialogComponent } from "../../dashboards/rol/filterdialog/filterdialog.component";
import { DashEstoqueService } from "./dashestoque.service";
import { Subject, takeUntil } from "rxjs";
import { style } from "@angular/animations";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    seriesSku: ApexAxisChartSeries;
    chartSku: ApexChart;
    dataLabelsSku: ApexDataLabels;
    plotOptionsSku: ApexPlotOptions;
    yaxisSku: ApexYAxis;
    xaxisSku: any; //ApexXAxis;
    annotationsSku: ApexAnnotations;
    fillSku: ApexFill;
    strokeSku: ApexStroke;
    gridSku: ApexGrid;
    seriesCurSku: ApexNonAxisChartSeries;
    chartCurSku: ApexChart;
    responsiveCurSku: ApexResponsive[];
    labelsCurSku: any;
    seriesFor: ApexAxisChartSeries;
    chartFor: ApexChart;
    dataLabelsFor: ApexDataLabels;
    plotOptionsFor: ApexPlotOptions;
    xaxisFor: ApexXAxis;

};

export type ChartOptionsSku = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    dataLabels: ApexDataLabels;
    annotationsSku: ApexAnnotations;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    grid: ApexGrid;
    xaxis: ApexXAxis;

};

export type chartOptionsCurvSKU = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

@Component({
    selector: 'app-dashestoque',
    templateUrl: './dashestoque.component.html',
    styleUrls: ['./dashestoque.component.scss', '../../util/css/css.component.scss'],
    //selector: 'table-basic-example',
    // standalone: true,
    encapsulation: ViewEncapsulation.None,

    changeDetection: ChangeDetectionStrategy.Default,


})
export class DashestoqueComponent implements AfterViewInit {
    @ViewChild("chart") chart: ChartComponent;
    @ViewChild("chart2") chart2: ChartComponent;
    @ViewChild("chart3") chart3: ChartComponent;
    @ViewChild("chart4") chart4: ChartComponent;
    @ViewChild("chatTable") chatTable: ChartComponent;
    @ViewChild("chartSku") chartSku: ChartComponent;
    @ViewChild("chartCurvSku") chartCurvSku: ChartComponent;


    public chartOptions: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    public chartOptions4: Partial<ChartOptions>;
    public chartOptionsSku: Partial<ChartOptionsSku>;
    public chartOptionsCurvSKU: ApexOptions;
    public chartOptionsFor: Partial<ChartOptions>;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource([]);



    titulo: string = "Indicadores de Estoque";
    subTitulo: string = "Análise por Marcas";
    isToggleOn: boolean;
    displayedColumns: string[] = ["Cód. Prod", "Produto", "Cód Emp", "Empresa", "Qtd. Dias"];
    diasEstoque: String[] = [];
    diasEstoque30d: String[] = []
    diasEstoquetot30d: number = 1;
    diasEstoque60d: String[] = [];
    diasEstoquetot60d: number = 1;
    diasEstoque90d: String[] = [];
    diasEstoquetot90d: number = 1;
    diasEstoque91d: String[] = [];
    diasEstoquetot91d: number = 1;
    filteredRnkRolTable: any;
    skusEmpresa: SkusEmp[] = [];
    skusCurva: SkusCurva[] = [];
    data: any;
    recentTransactionsTableColumns: string[] = [];



    //dataSource = [];
    tituloTable: String = null;
    dataSource = new MatTableDataSource<PeriodicElement>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;



    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngAfterViewInit(): void {

    }




    constructor(public dashEstoqueServico: DashEstoqueService, private _httpClient: HttpClient,
        private _liveAnnouncer: LiveAnnouncer, private _dialog: MatDialog, private _router: Router) {


        this.recentTransactionsTableColumns = [
            "codprod", "produto", "codemp", "empresa", "qtdDias"
        ];


        for (let index = 0; index < 23; index++) {
            const element: SkusEmp = {
                codemp: index,
                codprod: [1],
                empresa: ""

            };
            this.skusEmpresa.push(element);


        }
        //  this.iniciarComponentesDiasEstoque;


        //this.iniciarComponentesDiasEstoque;

        //this.getDiasEstoque();

        // this.getDiasEstoque();

        this.getDiasEstoque();


        this.chartOptions = {
            series: [this.diasEstoquetot30d],

            chart: {
                type: "radialBar",
                offsetY: -20,

            },
            plotOptions: {

                radialBar: {

                    startAngle: -90,
                    endAngle: 90,
                    track: {

                        background: "#94A3B8",
                        strokeWidth: "97%",
                        margin: 5, // margin is in pixels
                        dropShadow: {

                            enabled: true,
                            top: 2,
                            left: 0,
                            opacity: 0.31,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false,
                            color: "#FF8C00"
                        },
                        value:
                        {

                            offsetY: -2,
                            fontSize: "22px"
                        }
                    }
                }

            },


            fill: {
                colors: ['#FF8C00'],
                type: "gradient",
                gradient: {
                    shade: "light",
                    shadeIntensity: 0.4,
                    inverseColors: false,



                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                }

            },
            labels: ["90 Dias"],
            // background: "#87D4F9",

        };




        this.chartOptions2 = {
            series: [this.diasEstoquetot60d],

            chart: {
                type: "radialBar",
                offsetY: -20
            },
            plotOptions: {

                radialBar: {

                    startAngle: -90,
                    endAngle: 90,
                    track: {

                        background: "#94A3B8",
                        strokeWidth: "97%",
                        margin: 5, // margin is in pixels
                        dropShadow: {

                            enabled: true,
                            top: 2,
                            left: 0,
                            opacity: 0.31,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false,
                            color: "#FF8C00"
                        },
                        value:
                        {

                            offsetY: -2,
                            fontSize: "22px"
                        }
                    }
                }
            },
            fill: {
                colors: ['#FF8C00'],
                type: "gradient",
                gradient: {
                    shade: "light",
                    shadeIntensity: 0.4,
                    inverseColors: false,



                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                }

            },
            labels: ["90 Dias"],
            // background: "#87D4F9",

        };

        this.chartOptions3 = {
            series: [this.diasEstoquetot90d],

            chart: {
                type: "radialBar",
                offsetY: -20
            },
            plotOptions: {

                radialBar: {

                    startAngle: -90,
                    endAngle: 90,
                    track: {

                        background: "#94A3B8",
                        strokeWidth: "97%",
                        margin: 5, // margin is in pixels
                        dropShadow: {

                            enabled: true,
                            top: 2,
                            left: 0,
                            opacity: 0.31,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false,
                            color: "#FF8C00"
                        },
                        value:
                        {

                            offsetY: -2,
                            fontSize: "22px"
                        }
                    }
                }
            },
            fill: {
                colors: ['#FF8C00'],
                type: "gradient",
                gradient: {
                    shade: "light",
                    shadeIntensity: 0.4,
                    inverseColors: false,



                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                }

            },
            labels: ["90 Dias"],
            // background: "#87D4F9",

        };
        this.chartOptions4 = {
            series: [this.diasEstoquetot91d],

            chart: {
                type: "radialBar",
                offsetY: -20
            },
            plotOptions: {

                radialBar: {

                    startAngle: -90,
                    endAngle: 90,
                    track: {

                        background: "#94A3B8",
                        strokeWidth: "97%",
                        margin: 5, // margin is in pixels
                        dropShadow: {

                            enabled: true,
                            top: 2,
                            left: 0,
                            opacity: 0.31,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false,
                            color: "#FF8C00"
                        },
                        value:
                        {

                            offsetY: -2,
                            fontSize: "22px"
                        }
                    }
                }
            },
            fill: {
                colors: ['#FF8C00'],
                type: "gradient",
                gradient: {
                    shade: "light",
                    shadeIntensity: 0.4,
                    inverseColors: false,



                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                }

            },
            labels: ["90 Dias"],
            // background: "#87D4F9",

        };


        /*grafico SKU por Empresa*/


        this.chartOptionsSku = {

            series: [
                {
                    name: "Qtd. SKUs",
                    data: [this.skusEmpresa[0].codprod.length,
                    this.skusEmpresa[1].codprod.length,
                    this.skusEmpresa[2].codprod.length,
                    this.skusEmpresa[3].codprod.length,
                    this.skusEmpresa[4].codprod.length,
                    this.skusEmpresa[5].codprod.length,
                    this.skusEmpresa[6].codprod.length,
                    this.skusEmpresa[7].codprod.length,
                    this.skusEmpresa[8].codprod.length,
                    this.skusEmpresa[9].codprod.length,
                    this.skusEmpresa[10].codprod.length,
                    this.skusEmpresa[11].codprod.length,
                    this.skusEmpresa[12].codprod.length,
                    this.skusEmpresa[13].codprod.length,
                    this.skusEmpresa[14].codprod.length,
                    this.skusEmpresa[15].codprod.length,
                    this.skusEmpresa[16].codprod.length,
                    this.skusEmpresa[17].codprod.length,
                    this.skusEmpresa[18].codprod.length,
                    this.skusEmpresa[19].codprod.length,
                    this.skusEmpresa[20].codprod.length,
                    this.skusEmpresa[21].codprod.length,
                    this.skusEmpresa[22].codprod.length,




                    ]
                }
            ],
            annotationsSku: {
                points: [
                    {
                        x: "Bananas",
                        seriesIndex: 0,
                        label: {
                            borderColor: "#FF8C00",
                            offsetY: 0,
                            style: {
                                color: "#FF8C00",
                                background: "#FF8C00"
                            },
                            text: "Bananas are good"
                        }
                    }
                ]
            },
            chart: {
                height: 250,
                width: 600,
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "50%",

                    colors: {
                        ranges: [
                            {
                                from: 0,
                                to: 999999999999999,
                                color: '#FF8C00', // Cor para valores entre 0 e 50
                            },
                        ],
                    }


                    //endingShape: "rounded"
                }

            },
            dataLabels: {
                enabled: false
            },

            stroke: {
                width: 1,
                colors: ['#94A3B8']


            },
            /*
                        gridSku: {
                            row: {
                                colors: ["#fff", "#f2f2f2"]
                            }
                        },*/
            xaxis: {
                labels: {
                    rotate: -45,
                    //  with: 1
                    style: {
                        fontSize: '11px'
                    }
                },
                categories: [
                    this.skusEmpresa[0].empresa,
                    this.skusEmpresa[1].empresa,
                    this.skusEmpresa[2].empresa,
                    this.skusEmpresa[3].empresa,
                    this.skusEmpresa[4].empresa,
                    this.skusEmpresa[5].empresa,
                    this.skusEmpresa[6].empresa,
                    this.skusEmpresa[7].empresa,
                    this.skusEmpresa[8].empresa,
                    this.skusEmpresa[9].empresa,
                    this.skusEmpresa[10].empresa,
                    this.skusEmpresa[11].empresa,
                    this.skusEmpresa[12].empresa,
                    this.skusEmpresa[13].empresa,
                    this.skusEmpresa[14].empresa,
                    this.skusEmpresa[15].empresa,
                    this.skusEmpresa[16].empresa,
                    this.skusEmpresa[17].empresa,
                    this.skusEmpresa[18].empresa,
                    this.skusEmpresa[19].empresa,
                    this.skusEmpresa[20].empresa,
                    this.skusEmpresa[21].empresa,
                    this.skusEmpresa[22].empresa,



                ],
                tickPlacement: "on"
            },
            yaxis: {
                title: {
                    text: "SKUs"
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [50, 0, 100]
                }
            }

        };


        // Curva por SKU

        this.chartOptionsCurvSKU = {
            series: [0,0,0,0,0,0 ],

            chart: {
                type: "donut",
                height: 200, // Altere a altura do gráfico aqui
                width: 300,  // Altere a largura do gráfico aqui

            },
            labels: ["Curva A", "Curva B", "Curva C", "Curva F", "Curva J", "Curva N"],

            responsive: [
                {
                    breakpoint: 500,
                    options: {
                        chart: {
                            width: 100
                        },
                        legend: {
                            position: "right"
                        }
                    }
                }
            ]

        };

        // Estoque Por fornecedor

        this.chartOptionsFor = {
            seriesFor: [
                {
                    name: "Estoque",
                    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
                }
            ],
            chartFor: {
                type: "bar",
                height: 300,
                width: 580
            },
            plotOptionsFor: {
                bar: {
                    horizontal: true
                }
            },
            dataLabelsFor: {
                enabled: false
            },
            xaxisFor: {
                categories: [
                    "BELLARUBBER LTDA",
                    "REI AUTO PARTS",
                    "BELLARUBBER LTDA",
                    "CERCENA S/A IND METALURGICA",
                    "METALURGICA RIVERTEC LT",
                    "BORGWARNER BRASIL LTDA.",
                    "EURORICAMBI",
                    "CONIMEL EMPRESA DE MATERIAL ELETRICO LTDA",
                    "ZL BRASIL",
                    "JAHU BORRACHAS E AUTOPECAS LTDA"
                ]
            }
        };

    }


    filterDialog(event: MouseEvent, column: string, headerLabel: string): void {


        const columnList = new Set(
            // this.filteredRnkRolTable.map((data) => data[column])
        );
        const listArray = Array.from(columnList).filter(
            (element) => element !== null && element !== undefined
        );
        if (typeof listArray[0] === 'number') {
            listArray.sort((a: number, b: number) => a - b);
        } else {
            listArray.sort();
        }
        const dialogRef = this._dialog.open(FilterDialogComponent, {
            width: '350px',
            data: {
                columnName: column,
                headerLabel,
                columnData: listArray,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const filteredItems = this.filteredRnkRolTable.filter((item) =>
                    result.includes(item[column])
                );
                this.recentTransactionsDataSource.data = filteredItems;
            }
            if (Array.isArray(result) && result.length == 0) {
                this.recentTransactionsDataSource.data =
                    this.filteredRnkRolTable;
            }
        });
        event.stopPropagation();
    }


    /*  iniciarComponentesDiasEstoque(): void {




      }*/
    /*
        iniciarComponentesSkuPorEmpresa() {

        }*/






    atualizarTabela(param: number): void {

        if (param == 1) {
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.carregarTable(this.diasEstoque30d));
            this.tituloTable = 'Até 30 Dias de Estoque';
            this.filteredRnkRolTable = this.diasEstoque30d;

        } else if (param == 2) {
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.carregarTable(this.diasEstoque60d));
            this.tituloTable = 'De 31 à 60 Dias de Estoque';
            this.filteredRnkRolTable = this.diasEstoque60d;
        } else if (param == 3) {
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.carregarTable(this.diasEstoque90d));
            this.tituloTable = 'De 61 à 90 Dias de Estoque';
            this.filteredRnkRolTable = this.diasEstoque90d;
        } else {
            this.dataSource = new MatTableDataSource<PeriodicElement>(this.carregarTable(this.diasEstoque91d));
            this.tituloTable = 'Mais de 90 Dias de Estoque';
            this.filteredRnkRolTable = this.diasEstoque91d;
        }

        this.filteredRnkRolTable = this.dataSource;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator.length = this.dataSource.data.length;
    };



    getDiasEstoque() {
        this._httpClient.get<{ columns: [], rows: [] }>('http://api.portal.jspecas.com.br/v1/views/519/data?')
            .subscribe(dataresponse => {
                this.diasEstoque = dataresponse.rows;

                // console.log(dataresponse.rows);
                this.formatarDiasEstoque();
                this.formatarSkusPorEmpresa();
                this.atualizarTabela(1);
                this.formatarSkusPorCurva();


            });
    }


    formatarDiasEstoque() {
        //    this.chartOptions = null;

        this.diasEstoquetot30d = 0;


        for (let i = 0; i < this.diasEstoque.length; i++) {
            if (Number(this.diasEstoque[i][7]) <= 30 && Number(this.diasEstoque[i][7]) > 0) {
                this.diasEstoque30d.push(this.diasEstoque[i])
            } else if (Number(this.diasEstoque[i][7]) <= 60 && Number(this.diasEstoque[i][7]) > 0) {
                this.diasEstoque60d.push(this.diasEstoque[i])
            } else if (Number(this.diasEstoque[i][7]) <= 90 && Number(this.diasEstoque[i][7]) > 0) {
                this.diasEstoque90d.push(this.diasEstoque[i])
            } else {
                this.diasEstoque91d.push(this.diasEstoque[i])
            }


        }

        this.diasEstoquetot30d = Math.round((this.diasEstoque30d.length / this.diasEstoque.length) * 100);
        this.diasEstoquetot60d = Math.round((this.diasEstoque60d.length / this.diasEstoque.length) * 100);
        this.diasEstoquetot90d = Math.round((this.diasEstoque90d.length / this.diasEstoque.length) * 100);
        this.diasEstoquetot91d = Math.round((this.diasEstoque91d.length / this.diasEstoque.length) * 100);

        //    console.log(this.diasEstoque30d);

        // Porcentagem = (Parte / Total) * 100


        //var reflow = new ApexCharts(this.chart, );
        //reflow.render;
        //this.chart.updateSeries();


        //  const reflow = new ApexCharts(this.chart, this.chartOptions);

        // Atualize o gráfico existente com as novas configurações
        //eflow.showSeries;

        //var reflow = new ApexCharts(this.chart2, this.chartOptions2);
        //var reflow = new ApexCharts(this.chart3, this.chartOptions3);
        //var reflow = new ApexCharts(this.chart4, this.chartOptions4);
        this.atualizarDiasEstoque();
    }

    atualizarDiasEstoque() {
        this.chartOptions.series = [this.diasEstoquetot30d];
        this.chartOptions2.series = [this.diasEstoquetot60d];
        this.chartOptions3.series = [this.diasEstoquetot90d];
        this.chartOptions4.series = [this.diasEstoquetot91d];

    }




    formatarSkusPorEmpresa() {
        const empresas: number[] = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 28];
        this.skusEmpresa = [];


        for (let index = 0; index < empresas.length; index++) {
            let elemento: SkusEmp = {
                codemp: empresas[index],
                empresa: "",
                codprod: [],
            }


            for (let i = 0; i < this.diasEstoque.length; i++) {

                if (this.diasEstoque[i][8] === 'N') {



                    if (Number(this.diasEstoque[i][2]) === elemento.codemp) {
                        elemento.empresa = this.diasEstoque[i][3];
                        elemento.codprod.push(Number(this.diasEstoque[i][0]));
                        //  const skusAux: skus = {
                        //    codprod: Number(this.diasEstoque[i][0]),
                        // codemp: Number(this.diasEstoque[i][2])

                    }

                }

            }
            this.skusEmpresa.push(elemento);



        }
        this.atualizarSkuEmpresa();
        //this.atualizarSkuEmpresa();
        // this.iniciarComponentesDiasEstoque();
        var reflow = new ApexCharts(this.chartSku, this.chartOptionsSku);
    }


    atualizarSkuEmpresa() {
        this.chartOptionsSku = {

            series: [
                {
                    name: "Qtd. SKUs",
                    data: [this.skusEmpresa[0].codprod.length,
                    this.skusEmpresa[1].codprod.length,
                    this.skusEmpresa[2].codprod.length,
                    this.skusEmpresa[3].codprod.length,
                    this.skusEmpresa[4].codprod.length,
                    this.skusEmpresa[5].codprod.length,
                    this.skusEmpresa[6].codprod.length,
                    this.skusEmpresa[7].codprod.length,
                    this.skusEmpresa[8].codprod.length,
                    this.skusEmpresa[9].codprod.length,
                    this.skusEmpresa[10].codprod.length,
                    this.skusEmpresa[11].codprod.length,
                    this.skusEmpresa[12].codprod.length,
                    this.skusEmpresa[13].codprod.length,
                    this.skusEmpresa[14].codprod.length,
                    this.skusEmpresa[15].codprod.length,
                    this.skusEmpresa[16].codprod.length,
                    this.skusEmpresa[17].codprod.length,
                    this.skusEmpresa[18].codprod.length,
                    this.skusEmpresa[19].codprod.length,
                    this.skusEmpresa[20].codprod.length,
                    this.skusEmpresa[21].codprod.length,
                    this.skusEmpresa[22].codprod.length,




                    ]
                }
            ],
            annotationsSku: {
                points: [
                    {
                        x: "Bananas",
                        seriesIndex: 0,
                        label: {
                            borderColor: "#FF8C00",
                            offsetY: 0,
                            style: {
                                color: "#FF8C00",
                                background: "#FF8C00"
                            },
                            text: "Bananas are good"
                        }
                    }
                ]
            },
            chart: {
                height: 250,
                width: 600,
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "50%",

                    colors: {
                        ranges: [
                            {
                                from: 0,
                                to: 999999999999999,
                                color: '#FF8C00', // Cor para valores entre 0 e 50
                            },
                        ],
                    }


                    //endingShape: "rounded"
                }

            },
            dataLabels: {
                enabled: false
            },

            stroke: {
                width: 1,
                colors: ['#94A3B8']


            },
            /*
                        gridSku: {
                            row: {
                                colors: ["#fff", "#f2f2f2"]
                            }
                        },*/
            xaxis: {
                labels: {
                    rotate: -45,
                    //  with: 1
                    style: {
                        fontSize: '11px'
                    }
                },
                categories: [
                    this.skusEmpresa[0].empresa,
                    this.skusEmpresa[1].empresa,
                    this.skusEmpresa[2].empresa,
                    this.skusEmpresa[3].empresa,
                    this.skusEmpresa[4].empresa,
                    this.skusEmpresa[5].empresa,
                    this.skusEmpresa[6].empresa,
                    this.skusEmpresa[7].empresa,
                    this.skusEmpresa[8].empresa,
                    this.skusEmpresa[9].empresa,
                    this.skusEmpresa[10].empresa,
                    this.skusEmpresa[11].empresa,
                    this.skusEmpresa[12].empresa,
                    this.skusEmpresa[13].empresa,
                    this.skusEmpresa[14].empresa,
                    this.skusEmpresa[15].empresa,
                    this.skusEmpresa[16].empresa,
                    this.skusEmpresa[17].empresa,
                    this.skusEmpresa[18].empresa,
                    this.skusEmpresa[19].empresa,
                    this.skusEmpresa[20].empresa,
                    this.skusEmpresa[21].empresa,
                    this.skusEmpresa[22].empresa,



                ],
                tickPlacement: "on"
            },
            yaxis: {
                title: {
                    text: "SKUs"
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [50, 0, 100]
                }
            }

        };




    }



    formatarSkusPorCurva() {
        //const curvas: String[] = ["A","B","C","F","J","N"];
        //this.skusCurva = [];
        // console.log(empresas.length)

        const curvaA: SkusCurva = {
            curva: "A",
            skus: [],

        }
        const curvaB: SkusCurva = {
            curva: "B",
            skus: [],

        }
        const curvaC: SkusCurva = {
            curva: "C",
            skus: [],

        }
        const curvaF: SkusCurva = {
            curva: "F",
            skus: [],

        }
        const curvaJ: SkusCurva = {
            curva: "J",
            skus: [],

        }
        const curvaN: SkusCurva = {
            curva: "N",
            skus: [],

        }


        for (let i = 0; i < this.diasEstoque.length; i++) {


            let sku : Skus ={
                codprod: Number(this.diasEstoque[i][0]),
                codemp: Number(this.diasEstoque[i][2])
              }
              console.log( this.diasEstoque[i][9]);

            if (this.diasEstoque[i][9] === 'A') {

              curvaA.skus.push(sku);

            } else if (this.diasEstoque[i][9] === 'B'){


                  curvaB.skus.push(sku);
            }
            else if (this.diasEstoque[i][9] === 'C'){


                  curvaC.skus.push(sku);
            }
            else if (this.diasEstoque[i][9] === 'F'){


                  curvaF.skus.push(sku);
            }
            else if (this.diasEstoque[i][9] === 'J'){

                  curvaJ.skus.push(sku);
            }
            else {


                  curvaN.skus.push(sku);
            }

        }

    this.skusCurva.push(curvaA);
    this.skusCurva.push(curvaB);
    this.skusCurva.push(curvaC);
    this.skusCurva.push(curvaF);
    this.skusCurva.push(curvaJ);
    this.skusCurva.push(curvaN);
this.atualizarSkuCurva();
   // console.log( this.skusCurva);
    }
    // this.skusEmpresa.push(elemento);





    // var reflow= new ApexCharts(this.chartSku, this.chartOptionsSku);


    atualizarSkuCurva(){
         // Curva por SKU




         this.chartOptionsCurvSKU = {
            series: [this.skusCurva[0].skus.length,
                    this.skusCurva[1].skus.length,
                    this.skusCurva[2].skus.length,
                    this.skusCurva[3].skus.length,
                    this.skusCurva[4].skus.length,
                    this.skusCurva[5].skus.length],


            chart: {

                animations: {
                    speed: 100,
                    animateGradually: {
                        enabled: false,
                    },
                },
               // height: 200, // Altere a altura do gráfico aqui
                width: 400,  // Altere a largura do gráfico aqui
                fontFamily: 'inherit',
                foreColor: 'inherit',
               // height: '40%',
                type: 'donut',
               /* sparkline: {
                    enabled: true,
                },*/



            },
            colors: ['#FF8C00', '#DDA0DD', '#ADD8E6', '#006400', '#FF0000', '#00BFFF'],


            labels: ["Curva A", "Curva B", "Curva C", "Curva F", "Curva J", "Curva N"],
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '75%',
                    },
                },
            },
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
          /*  tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${
                                                        w.config.colors[
                                                           0
                                                        ]
                                                    };"></div>
                                                    <div class="ml-2 text-md leading-none">${
                                                        w.config.labels[
                                                          "teste"
                                                        ]
                                                    }:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${(
                                                        (w.config.series[
                                                            seriesIndex
                                                        ] *
                                                            100) /
                                                        w.config.series[0]
                                                    ).toFixed(2)}%</div>
                                                </div>`,
            },*/

            /*responsive: [
                {
                    breakpoint: 500,
                    options: {
                        chart: {
                            width: 100
                        },
                        legend: {
                            position: "right"
                        }

                    }
                }
            ]*/


        };
    }



carregarTable(param: String[]): PeriodicElement[] {


    let ELEMENT_DATA: PeriodicElement[] = [];
    for (let i = 0; i < param.length; i++) {
        let elemento: PeriodicElement = {
            codprod: Number(param[i][0]),
            produto: param[i][1],
            codemp: Number(param[i][2]),
            empresa: param[i][3],
            qtdDias: Number(param[i][7])
        };
        ELEMENT_DATA.push(elemento);



    }

    /*
    let  ELEMENT_DATA: PeriodicElement[] = [
        { position: 1998, name: 'CALCO PINHAO SEPARADOR ROLAM 13130 0001990', weight: 7, symbol: 'SA', symbol2: 35 },
        { position: 1564, name: 'RETENTOR TRS VIRABREQUIM 0002040', weight: 10, symbol: 'BH', symbol2: 50 },
        { position: 184, name: 'LONA FREIO DT 0002041', weight: 3, symbol: 'MT', symbol2: 30 },
        { position: 4861, name: 'JG ARRUELAS ENCOSTO 0,25MM MOTOR HS2.5T 0002045', weight: 9.0122, symbol: 'Be', symbol2: 10 },
        { position: 1846, name: 'PORCA M10 X 1,50 0002044', weight: 2, symbol: 'BL', symbol2: 37 },
        { position: 452, name: 'JG  PISTAO, PINO E TRAVAS 0002047', weight: 5, symbol: 'SL', symbol2: 52 },
        { position: 1578, name: 'JG  PISTAO, PINO E TRAVAS 0002047', weight: 7, symbol: 'SA', symbol2: 59 },
        { position: 5682, name: 'JG BRONZINA BIELA 0,25 0002053', weight: 23, symbol: 'RJ', symbol2: 46 },
        { position: 142, name: 'JG  PISTAO, PINO E TRAVAS 0002047', weight: 11, symbol: 'JP', symbol2: 35 },
        { position: 4562, name: 'PORCA AUTO-TRAVANTE, 3/8" UNF 0002054', weight: 17, symbol: 'IM', symbol2: 10 },
    ];*/

    return ELEMENT_DATA;
}


/** Announce the change in sort state for assistive technology. */
announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
        this._liveAnnouncer.announce('Sorting cleared');
    }
}




}






export interface PeriodicElement {
    codprod: number;
    produto: string;
    codemp: number;
    empresa: string;
    qtdDias: number;

}

export interface SkusEmp {
    codemp: number;
    empresa: String;
    codprod: number[];

}

export interface Skus {
    codemp: number;
    codprod: number;

}


export interface SkusCurva {
    curva: String;
    skus: Skus[];

}



/*
export interface DiasEstoque {
    codprod: number;
    codemp: number;
    qtdEstoque: number;
    media3m: string;
    symbol2: number;
}*/



