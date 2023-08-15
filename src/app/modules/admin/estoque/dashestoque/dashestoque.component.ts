import { LiveAnnouncer } from "@angular/cdk/a11y";
import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ViewChild, Inject, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from "@angular/core";
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
import { map, Observable, startWith, Subject, takeUntil } from "rxjs";
import { style } from "@angular/animations";
import { isNumber, result } from "lodash";
import { labels } from "app/mock-api/apps/mailbox/data";
import { FormControl } from "@angular/forms";
import { ColorsComponent } from "../../util/colors/colors.component";


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
    @ViewChild("chartGiro") chartGiro: ChartComponent;


    public chartOptions: ApexOptions;
    public chartOptions2: ApexOptions;
    public chartOptions3: ApexOptions;
    public chartOptions4: ApexOptions;
    public chartOptionsDisponibilidadeEmpresa: ApexOptions;
    public chartOptionsDisponibilidadeSKU: ApexOptions;
    public chartOptionsDisponibilidadeAgrupador: ApexOptions;
    public chartOptionsFor: ApexOptions;
    public chartOptionsGiro: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource([]);
    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;



    titulo: string = "Indicadores de Estoque";
    subTitulo: string = "Análise de Estoque";
    isToggleOn: boolean;
    displayedColumns: string[] = ["Cód. Prod", "Produto", "Cód Emp", "Empresa", "Estoque", "Média 3 Meses", "Média 6 Meses", "Qtd. Dias"];
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
    DisponibilidadeEmpresa: Disponibilidade = { serie: [], categoria: [] };
    disponibilidadeAgrupador: Disponibilidade = { serie: [], categoria: [] };
    disponibilidadeSku: Disponibilidade = { serie: [], categoria: [] };
    tamanhoFor: number = 1;

    data: any;
    recentTransactionsTableColumns: string[] = [];

    estoquePorFornecedor: EstoqueFornecedor = { nomeParc: ["A"], SaldoEstoque: [1], percentual:[0] };
    //resumoEstoque ={giro:[], diasEstoque:[]}
    giroEstoque: GiroDiasEstoque = { serieGiro: [], SerieDias: [], categoria: [] };
    //giroVazio:GiroDias[]=[];

    estNomeFornecedor;
    estSaldoEstoque;
    codemp;
    codparcfor;
    qtdForn = 20;
    codmarca;
    curva;


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





    constructor(public dashEstoqueServico: DashEstoqueService, private _httpClient: HttpClient,
        private _liveAnnouncer: LiveAnnouncer, private _dialog: MatDialog, private _router: Router, private _colors: ColorsComponent) {
        this.codemp = "99";
        this.codparcfor = "9999999";
        this.codmarca = "9999999";
        this.curva = "9999999";
        this.tamanhoFor = this.estoquePorFornecedor.SaldoEstoque.length * 0.05;
        this.recentTransactionsTableColumns = [
            "codprod", "produto", "codemp", "empresa", "estoque", "media3m", "media6m", "qtdDias"
        ];






        //  this.iniciarComponentesDiasEstoque;


        //this.iniciarComponentesDiasEstoque;

        //this.getDiasEstoque();

        // this.getDiasEstoque();
        this.getDisponibilidadeCurva(this.codemp, this.codparcfor, this.codmarca, this.curva);
        this.getDisponibilidadeEmpresa(this.codemp, this.codparcfor, this.codmarca, this.curva);

        this.getDiasEstoque(this.codemp, this.codparcfor, this.codmarca, this.curva);
        this.getEstoquePorFornecedor(this.qtdForn, this.codemp, this.codparcfor, this.codmarca, this.curva);
        this.getGiroEstoque(this.codemp, this.codparcfor, this.codmarca, this.curva);


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

        this.chartOptionsDisponibilidadeEmpresa = {

            series: [
                {
                    name: "Qtd. SKUs",
                    data: []
                }
            ],

            chart: {
                height: 225,
                width: "100%",
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "50%",

                }

            },
            colors: this._colors.colors,
            dataLabels: {
                enabled: false
            },

            stroke: {
                width: 1,
                colors: ['#94A3B8']


            },

            xaxis: {
                labels: {
                    rotate: -45,
                    //  with: 1
                    style: {
                        fontSize: '10px'
                    }
                },
                categories: [],
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


        this.chartOptionsDisponibilidadeSKU = {

            series: [
                {
                    name: "Qtd. SKUs",
                    data: []
                }
            ],

            chart: {
                height: 200,
                width: 200,
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "30%",

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
                categories: [],
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



        /*

        this.chartOptionsDisponibilidadeSKU = {
            series: [0, 0, 0, 0, 0, 0],

            chart: {
                type: "donut",
                height: 200, // Altere a altura do gráfico aqui
                width: 100,  // Altere a largura do gráfico aqui

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

        };*/

        // Estoque Por fornecedor

        this.chartOptionsFor = {
            series: [
                {
                    name: "Estoque",
                    data: [1]
                }
            ],
            colors: [this._colors.colors[1]],
            chart: {
                type: "bar",
                height: this.tamanhoFor * 700,
                width: "100%"
            },
            tooltip: {
                theme: 'dark',
            },
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: [
                    "t"

                ]
            }
        };

        // Giro de Estoque

        this.chartOptionsGiro = {
            series: [
                {
                    name: "Dias de Estoque",
                    data: []
                },
                {
                    name: "Giro de Estoque",
                    data: []
                },

                /* {
                   name: "Ruptura de Estoque",
                   data: [35, 41, 36, 26, 45,16]
                 },*/
            ],
            chart: {
                type: "bar",
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    //  endingShape: "rounded"
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            },
            xaxis: {
                categories: [
                    "Curva A",
                    "Curva B",
                    "Curva C",
                    "Curva F",
                    "Curva J",
                    "Curva N"
                ]
            },
            yaxis: {
                title: {
                    text: "$ (thousands)"
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val + " thousands";
                    }
                }
            }
        };

        // Disponibilidade Por Agrupador



        this.chartOptionsDisponibilidadeAgrupador = {

            series: [
                {
                    name: "Qtd. SKUs",
                    data: this.disponibilidadeAgrupador.serie
                }
            ],
            colors: [this._colors.colors[0]],

            chart: {
                height: 200,
                width: "100%",
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "50%",

                    /*  colors: {
                          ranges: [
                              {
                                  from: 0,
                                  to: 999999999999999,
                              //    color: '#FF8C00', // Cor para valores entre 0 e 50
                              },
                          ],
                      }*/


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
                categories: this.disponibilidadeAgrupador.categoria,
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


            /*    this.chartOptionsDisponibilidadeAgrupador = {
                    series: [],


                    chart: {
                        foreColor: '#696969',
                        animations: {
                            speed: 100,
                            animateGradually: {
                                enabled: false,
                            },
                        },
                        // height: 200, // Altere a altura do gráfico aqui
                        width: "100%",  // Altere a largura do gráfico aqui
                        fontFamily: 'inherit',


                        // height: '40%',
                        type: 'donut',




                    },
                    colors: ['#FF8C00', '#DDA0DD', '#ADD8E6', '#006400', '#FF0000', '#00BFFF'],


                    labels: [],

                    dataLabels: {
                        style: {
                            fontSize: '13px',
                            //fontWeight: 'bold',
                            colors: ['#0a0a0a'],
                        },

                    },

                    plotOptions: {
                        pie: {
                            customScale: 0.9,
                            expandOnClick: true,
                            donut: {
                                size: '75%',

                            },

                        },


                    },


                };*/

        }

    }
    ngAfterViewInit(): void {
        this.atualizarDisponibilidadeEmpresa();
        //this.atualizarFornecedor();

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

    getGeral(codemp, codmarca, codparcfor, curva) {

        this.curva = curva;

        if (codemp == 'null') {
            codemp = '99'
        }

        if (codparcfor == 'null') {
            codparcfor = '9999999'
        }
        if (codmarca == 'null') {
            codmarca = '9999999'
        }

        if (this.curva == 'null') {
            this.curva = "9999999";

        }



        this.codemp = codemp;
        this.codparcfor = codparcfor;




        this.getDiasEstoque(codemp, codparcfor, codmarca, this.curva);
        this.getGiroEstoque(codemp, codparcfor, codmarca, this.curva);
        this.getDisponibilidadeCurva(codemp, codparcfor, codmarca, this.curva);
        this.getDisponibilidadeEmpresa(codemp, codparcfor, codmarca, this.curva);
        this.getEstoquePorFornecedor(this.qtdForn, codemp, codparcfor, codmarca, this.curva);

    }


    getDiasEstoque(codemp, codparcfor, codmarca, curva) {

        this.limparDiasEstoque();


        this.dashEstoqueServico.getDiasEstoque(codemp, codparcfor, codmarca, curva).subscribe((dataresponse) => {
            this.diasEstoque = dataresponse.rows;
            this.formatarDiasEstoque();
            this.atualizarTabela(1);
        });
    }







    getGiroEstoque(codemp, codparcfor, codmarca, curva) {

        this.limparGiroEstoque();
        this.dashEstoqueServico.getGiroEstoque(codemp, codparcfor, codmarca, curva).subscribe((dataresponse) => {
            this.formatarGiroDiasEstoque(dataresponse.rows);


        });
    }


    getDisponibilidadeCurva(codemp, codparcfor, codmarca, curva) {


        this.limparDisponibilidadeCurva();
        this.dashEstoqueServico.getDisponibilidadeCurva(codemp, codparcfor, codmarca, curva).subscribe((dataresponse) => {
            this.formatarDisponibilidade(dataresponse.rows);


        });




    }

    getEstoquePorFornecedor(numero, codemp, codparcfor, codmarca, curva) {

        this.limparEstoqueFornecedor();
        this.dashEstoqueServico.getEstoquePorFornecedor(numero, codemp, codparcfor, codmarca, curva).subscribe((dataresponse) => {

            this.formatarEstoqueFornecedor(dataresponse.rows);


        });




    }

    getDisponibilidadeEmpresa(codemp, codparcfor, codmarca, curva) {


        this.limparDisponibilidadeEmpresa();
        this.dashEstoqueServico.getDisponibilidadeEmpresa(codemp, codparcfor, codmarca, curva).subscribe((dataresponse) => {
            this.formatarDisponibilidadeEmpresa(dataresponse.rows);


        });




    }


    limparDiasEstoque() {
        this.diasEstoque = [];
        this.diasEstoquetot30d = 1;
        this.diasEstoquetot60d = 1;
        this.diasEstoquetot90d = 1;
        this.diasEstoquetot91d = 1;
        this.diasEstoque30d = [];
        this.diasEstoque60d = [];
        this.diasEstoque90d = [];
        this.diasEstoque91d = [];


    }

    limparGiroEstoque() {


        this.giroEstoque.serieGiro = [];
        this.giroEstoque.SerieDias = [];
        this.giroEstoque.categoria = [];



    }

    limparDisponibilidadeCurva() {

        this.disponibilidadeAgrupador.categoria = [];
        this.disponibilidadeAgrupador.serie = [];
        this.disponibilidadeSku.categoria = [];
        this.disponibilidadeSku.serie = [];





    }
    limparDisponibilidadeEmpresa() {
        this.DisponibilidadeEmpresa.serie = [];
        this.DisponibilidadeEmpresa.categoria = [];

    }
    limparEstoqueFornecedor() {


        this.estoquePorFornecedor.nomeParc = [];
        this.estoquePorFornecedor.SaldoEstoque = [];
        this.estoquePorFornecedor.percentual =[];




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



    atualizarDisponibilidadeEmpresa() {
        this.chartOptionsDisponibilidadeEmpresa = {

            series: [
                {
                    name: "Qtd. SKUs",
                    data: this.DisponibilidadeEmpresa.serie
                }
            ],

            chart: {
                height: 225,
                width: "100%",
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "60%",

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
                categories: this.DisponibilidadeEmpresa.categoria,
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



    formatarEstoqueFornecedor(param: string[]) {

        let fornecedor: string[] = [];
        let saldo: number[] = [];
        for (let i = 0; i < param.length; i++) {

            this.estoquePorFornecedor.nomeParc.push(param[i][1]);
            this.estoquePorFornecedor.SaldoEstoque.push(Math.floor(Number(param[i][4])));
            this.estoquePorFornecedor.percentual.push(Number(param[i][5]));

        }

        this.tamanhoFor = this.estoquePorFornecedor.SaldoEstoque.length * 0.05;

        this.atualizarFornecedor();
    }


    formatarDisponibilidade(param: string[]) {


        for (let i = 0; i < param.length; i++) {



            this.disponibilidadeAgrupador.categoria.push(param[i][0]);
            this.disponibilidadeAgrupador.serie.push(Math.round(Number(param[i][4]) * 100) / 100);
            this.disponibilidadeSku.categoria.push(param[i][0]);
            this.disponibilidadeSku.serie.push(Math.round(Number(param[i][3]) * 100) / 100);

        }



        this.atualizarDisponibilidadeAgrupador();
        this.atualizarDisponibilidadeSku();


    }


    formatarDisponibilidadeEmpresa(param: string[]) {


        for (let i = 0; i < param.length; i++) {



            this.DisponibilidadeEmpresa.categoria.push(param[i][1]);
            this.DisponibilidadeEmpresa.serie.push(Math.round(Number(param[i][4]) * 100) / 100);


        }


        this.atualizarDisponibilidadeEmpresa();


    }



    formatarGiroDiasEstoque(param: string[]) {


        for (let i = 0; i < param.length; i++) {

            this.giroEstoque.serieGiro.push(Math.round(Number(param[i][1]) * 100) / 100);
            this.giroEstoque.SerieDias.push(Math.round(Number(param[i][2]) * 100) / 100);
            this.giroEstoque.categoria.push(param[i][0]);



        }



        this.atualizarResumoEstoque();
    }








    atualizarResumoEstoque() {


        // Giro de Estoque

        this.chartOptionsGiro = {
            series: [
                /* {
                     name: "Dias de Estoque",
                     data: this..giro
                 },*/
                {
                    color: "#ed7b00",
                    name: "Giro de Estoque",
                    type: "line",
                    data: this.giroEstoque.serieGiro
                },

                {
                    color: "#6e7a8a",
                    name: "Dias de Estoque",
                    type: "line",
                    data: this.giroEstoque.SerieDias
                },
            ],
            chart: {
                type: "line",
                height: 350,
                width: "100%"
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    //  endingShape: "rounded"
                    dataLabels: {
                        position: 'top',


                    }
                }
            },
            dataLabels: {
                enabled: true,
                // offsetY: -20,
                style: {
                    colors: ['#ed7b00', '#6e7a8a'],

                }

            },

            stroke: {
                show: true,
                width: [2, 2],
                colors: ['#ed7b00', '#6e7a8a']
            },
            xaxis: {
                categories: this.giroEstoque.categoria
            },
            yaxis: [
                {
                    axisTicks: {
                        show: true
                    },
                    /*axisBorder: {
                      show: true,
                      color: "#ed7b00"
                    },*/
                    labels: {
                        style: {
                            // color: "#008FFB"
                        }
                    },
                    title: {
                        text: "Giro de Estoque",
                        style: {
                            color: "#ed7b00"
                        }
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                {
                    seriesName: "Income",
                    opposite: true,
                    axisTicks: {
                        show: true
                    },
                    /* axisBorder: {
                       show: true,
                       color: "#ed7b00"
                     },*/
                    labels: {
                        style: {
                            // color: "#00E396"
                        }
                    },
                    title: {
                        text: "Dias de Estoque",
                        style: {
                            color: "#6e7a8a"
                        }
                    }
                },

            ],
            fill: {
                opacity: 1
            },

        };



    }


    atualizarFornecedor() {
        this.chartOptionsFor = {
            series: [
                {
                    name: "Saldo de Estoque",

                    data: this.estoquePorFornecedor.SaldoEstoque 
                },
                /*{
                    name: "% de Estoque",

                    data: this.estoquePorFornecedor.percentual
                },*/
             
            ],
            colors: [this._colors.colors[1]],
            annotations: {
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
                type: "bar",
                height: this.tamanhoFor * 700,
              // stacked: true,
                width: "100%",
              
            },
           

            tooltip: {
                followCursor: true,
                theme: 'dark',
                y: {
                    formatter: (val) => {
                        return (this.formatadorPts(val));
                    }
                },
            },

            plotOptions: {

                bar: {
                    horizontal: true,
                /*dataLabels:{
                    position: "right"
                }*/
                }
                
            },

            dataLabels: {
                formatter: (val) => {
                    return (this.formatadorMilhar(val) );
                    
                },
          
                //textAnchor:'end',
                offsetX:20,
                enabled: true,
                style: {
                    
                    colors: ["#0a0a0a"],
                    fontSize: "10px",
                    fontWeight: "bold"


                }
            
            },
            /*
                        stroke: {
                            width: 1,
                            colors: ['#94A3B8']


                        },*/
            xaxis: {
                labels: {
                    rotate: -45,
                    //  with: 1
                    style: {
                        fontSize: '11px',


                    },
                    formatter: (val) => {
                        return (this.formatadorPts(val) );
                    }

                },
                categories: this.estoquePorFornecedor.nomeParc,
                tickPlacement: "on"
            },
            yaxis: {
                title: {
                    text: "SKUs"
                },

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

    filtrarFornecedor(qtdforn, tamanho) {
        this.tamanhoFor = tamanho;
        this.limparEstoqueFornecedor();
        this.getEstoquePorFornecedor(qtdforn, this.codemp, this.codparcfor, this.codmarca, this.curva);

    }





    atualizarDisponibilidadeSku() {
        // Curva por SKU


        this.chartOptionsDisponibilidadeSKU = {

            series: [
                {
                    name: "% SKUs",
                    data: this.disponibilidadeSku.serie
                }
            ],

            chart: {
                height: 200,
                width: "100%",
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "40%",
                }

            },
            colors: [this._colors.colors[1]],
            dataLabels: {
                enabled: false
            },

            stroke: {
                width: 1,
                colors: ['#94A3B8']


            },

            xaxis: {
                labels: {
                    rotate: -45,
                    //  with: 1
                    style: {
                        fontSize: '11px'
                    }
                },
                categories: this.disponibilidadeSku.categoria,
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







    atualizarDisponibilidadeAgrupador() {
        // Disponibilidade Por Agrupador




        //this.chartOptionsDisponibilidadeAgrupador = {

        this.chartOptionsDisponibilidadeAgrupador = {

            series: [
                {
                    name: "% Agrupador",
                    data: this.disponibilidadeAgrupador.serie
                }
            ],
            colors: [this._colors.colors[0]],
            chart: {
                height: 200,
                width: "100%",
                type: "bar"
            },
            plotOptions: {

                bar: {
                    columnWidth: "40%",

                    /*  colors: {
                          ranges: [
                              {
                                  from: 0,
                                  to: 999999999999999,
                              //    color: '#FF8C00', // Cor para valores entre 0 e 50
                              },
                          ],
                      }*/


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
                categories: this.disponibilidadeAgrupador.categoria,
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




    carregarTable(param: String[]): PeriodicElement[] {


        let ELEMENT_DATA: PeriodicElement[] = [];
        for (let i = 0; i < param.length; i++) {
            let elemento: PeriodicElement = {
                codprod: Number(param[i][0]),
                produto: param[i][1],
                codemp: Number(param[i][2]),
                empresa: param[i][3],
                estoque: Number(param[i][4]),
                media3m: Number(param[i][5]),
                media6m: Number(param[i][6]),
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
            return String(val.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })).slice(3);
        }

        return val;
    }


    formatadorMilhar(val) {
        if (isNumber(val)) {
            if (!val) {
                val = 0;
            }
            return String(val.toLocaleString('pt-br', { style: 'decimal', useGrouping: true }));
        }

        return val;
    }
}










export interface PeriodicElement {
    codprod: number;
    produto: string;
    codemp: number;
    empresa: string;
    estoque: number;
    media3m: number;
    media6m: number;
    qtdDias: number;

}


export interface EstoqueFornecedor {

    nomeParc: string[];
    SaldoEstoque: number[];
    percentual: number[];
}


export interface Disponibilidade {

    serie: number[];
    categoria: string[];
}

export interface GiroDiasEstoque {

    serieGiro: number[];
    SerieDias: number[];
    categoria: string[];
}






