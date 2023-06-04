import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { RolService } from 'app/modules/admin/dashboards/rol/rol.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import {
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filterdialog/filterdialog.component';
import { default as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';

const moment = _rollupMoment || _moment;

@Component({
    selector: 'rol',
    templateUrl: './rol.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./rol.component.css'],
})
export class RolComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('pickerToggle') pickerToggle: MatDatepickerToggle<Date>;
    chartVisitors: ApexOptions;
    chartConversions: ApexOptions;
    chartImpressions: ApexOptions;
    chartVisits: ApexOptions;
    chartVisitorsVsPageViews: ApexOptions;
    chartNewVsReturning: ApexOptions;
    chartGender: ApexOptions;
    chartAge: ApexOptions;
    chartLanguage: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource([]);
    recentTransactionsDataSource2: MatTableDataSource<any> =
        new MatTableDataSource();
    maxRolSellerName: string;
    maxRolSellerBranch: string;
    minRolSellerName: string;
    minRolSellerBranch: string;

    recentTransactionsTableColumns: string[] = [];

    rankingRolHeaders: string[] = [
        'Posição',
        'Filial',
        'Vendedor',
        'ROL',
        'Meta',
        'Percentual',
    ];

    recentTransactionsTableColumns2: string[] = [
        'Posição',
        'Filial',
        'Vendedor',
        'Metas Atingidas',
    ];

    chartGithubIssues: ApexOptions = {};
    data: any;

    // Filtros principais do dashboard

    filiais = new FormControl(this._rolService.INITIAL_COMPANIES_IDS);
    filiaisObjects: { id: number; string: string }[];
    filiaisStringList: string[];
    allCompaniesSelected: boolean = false;

    vendedores = new FormControl(this._rolService.INITIAL_SELLERS_IDS);
    selectedSellers = new FormControl([]);

    vendedoresObjects: { id: number; string: string }[];
    filteredVendedoresObjects: { id: number; string: string }[];
    vendedoresStringList: string[];
    filteredVendedoresStringList: string[];
    allSellersSelected: boolean = false;

    sellersSearchInput = new FormControl('');

    start = new FormControl<Date | null>(null);
    end = new FormControl<Date | null>(null);

    dataInicio = this._rolService.INITIAL_INITIAL_DATE;
    dataFinal = this._rolService.INITIAL_FINAL_DATE;
    convDataIni: Date;
    today = new Date();

    isChecked: boolean;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _rolService: RolService,
        private _router: Router,
        private _cdr: ChangeDetectorRef,
        private _dialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this._rolService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                let myData = data.recentTransactions.rows.map((row) => {
                    return {
                        rank: row[0],
                        razaoabrev: row[1],
                        apelido: row[2],
                        rol: row[3],
                        meta: row[4],
                        percentual: row[5],
                    };
                });
                this.recentTransactionsDataSource.data = myData;

                this.recentTransactionsTableColumns = [
                    'rank',
                    'razaoabrev',
                    'apelido',
                    'rol',
                    'meta',
                    'percentual',
                ];

                this.recentTransactionsDataSource2.data =
                    data.recentTransactions2.rows;

                this.recentTransactionsDataSource.data.forEach((innerArray) => {
                    if (innerArray[3] === data.previousStatement.LIMITE) {
                        this.maxRolSellerName = innerArray[2];
                        this.maxRolSellerBranch = innerArray[1];
                    }
                });

                this.recentTransactionsDataSource.data.forEach((innerArray) => {
                    if (innerArray[3] === data.previousStatement.SPENT) {
                        this.minRolSellerName = innerArray[2];
                        this.minRolSellerBranch = innerArray[1];
                    }
                });

                // Uncomment the lines below to get tables headers from backend
                /* this.recentTransactionsTableColumns = data.recentTransactions.columns ;  */
                /* this.recentTransactionsTableColumns2 = data.recentTransactions2.columns ; */

                // Prepare the chart data
                this._prepareChartData();
                this.filiaisObjects = this.data.filiaisLista;
                this.filiaisStringList = this.filiaisObjects.map(
                    (item) => item.string
                );

                // Trigger the change detection mechanism so that it updates the chart when filtering
                this._cdr.markForCheck();
            });

        // Get the sellers data
        this._rolService.sellersData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.vendedoresObjects = data;
                this.vendedoresStringList = this.vendedoresObjects.map(
                    (item) => item.string
                );

                this.filteredVendedoresObjects = this.vendedoresObjects;
                this.filteredVendedoresStringList = this.vendedoresStringList;

                this._cdr.markForCheck();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.recentTransactionsDataSource.sort = this.sort;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    setInitialMY(evMY: Moment, datepicker: MatDatepicker<Moment>) {
        this.dataInicio = { year: evMY.year(), month: evMY.month(), date: 1 };
        this.start.setValue(
            new Date(this.dataInicio.year, this.dataInicio.month, 1)
        );
        datepicker.close();
    }

    setFinalMY(evMY: Moment, datepicker: MatDatepicker<Moment>) {
        function getLastDayOfMonth(year, month) {
            // Create a new date object with the given year and month (0-based index)
            let date = new Date(year, month + 1, 0);

            // Get the last day of the month
            let lastDay = date.getDate();

            return lastDay;
        }

        this.dataFinal = {
            year: evMY.year(),
            month: evMY.month(),
            date: getLastDayOfMonth(evMY.year(), evMY.month()),
        };
        this.end.setValue(
            new Date(
                this.dataFinal.year,
                this.dataFinal.month,
                getLastDayOfMonth(evMY.year(), evMY.month())
            )
        );

        datepicker.close();
    }

    resetDateInputs(): void {
        this.start.setValue(null);
        this.end.setValue(null);
    }

    filterDialog(event: MouseEvent, column: string): void {
        const columnList = new Set(
            this.recentTransactionsDataSource.data.map((data) => data[column])
        );

        const listArray = Array.from(columnList).filter(
            (element) => element !== null && element !== undefined
        );
        if (typeof listArray[0] === 'number') {
            listArray.sort((a, b) => a - b);
        } else {
            listArray.sort();
        }

        this._dialog.open(FilterDialogComponent, {
            width: '250px',
            data: {
                columnName: column,
                columnData: listArray,
            },
        });
        event.stopPropagation();
    }

    selectAllCompanies() {
        if (!this.allCompaniesSelected) {
            let newFiliais = this.filiaisObjects.map((item) =>
                item.id.toString()
            );
            this.filiais.setValue(newFiliais);
            this.allCompaniesSelected = true;
        } else {
            this.filiais.setValue(this._rolService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    selectAllSellers() {
        if (this.allSellersSelected || this.vendedoresObjects.length === 0) {
            this.vendedores.setValue(this._rolService.INITIAL_SELLERS_IDS);
            this.selectedSellers.setValue([]);
            this.allSellersSelected = false;
        } else {
            let newVendedores = this.filteredVendedoresObjects.map((item) =>
                item.id.toString()
            );
            this.vendedores.setValue(newVendedores);
            this.selectedSellers.setValue(newVendedores);
            this.allSellersSelected = true;
        }
    }

    handleDatePickerClick(event: Event) {
        // Makes DatePicker open by clicking anywhere in the input
        this.pickerToggle._open(event);
    }

    handleCompaniesFilterClick(dtIni, dtFin) {
        this.vendedores.setValue(this._rolService.INITIAL_SELLERS_IDS);
    }

    handleSellersFilterClick(dtIni, dtFin) {
        this._rolService
            .getSellersData(dtIni, dtFin, this.filiais.value)
            .subscribe();
        this.sellersSearchInput.setValue('');
    }

    handleCompanyFilterSelect(filialId: number) {
        //this.vendedoresStringList = ['Carregando...'];
        if (this.filiais.value.length > 0) {
            this.allCompaniesSelected = true;
        }
        if (this.filiais.value.length == 0) {
            this.filiais.setValue(this._rolService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    handleSellersFilterSelect(vendedorId: number) {
        const id = vendedorId.toString();
        if (this.vendedores.value.includes(id)) {
            this.selectedSellers.setValue([...this.selectedSellers.value, id]);
        } else {
            const updatedItems = this.selectedSellers.value.filter(
                (item) => item !== id
            );
            this.selectedSellers.setValue(updatedItems);
        }
        this.vendedores.setValue(this.selectedSellers.value);

        if (this.vendedores.value.length == 0) {
            this.vendedores.setValue(this._rolService.INITIAL_SELLERS_IDS);
        }
        if (this.selectedSellers.value.length > 0) {
            this.allSellersSelected = true;
        } else {
            this.allSellersSelected = false;
        }
    }

    addEventBegin(event: MatDatepickerInputEvent<Date>) {
        if (event.value) {
            this.dataInicio = event.value['_i'];
            this.end.setValue(null);
            this.dataFinal = event.value['_i'];
        }
    }

    addEventEnd(event: MatDatepickerInputEvent<Date>) {
        if (event.value) {
            this.dataFinal = event.value['_i'];
        }
    }

    handleApplyFilter(dtIni, dtFin, filiaisIds, vendedoresIds) {
        if (dtIni && dtFin) {
            this._rolService
                .getData(dtIni, dtFin, filiaisIds, vendedoresIds)
                .subscribe();
        }
    }

    onInput(value: string) {
        const filteredSellers = this.vendedoresObjects.filter((seller) =>
            seller.string.toLowerCase().includes(value.toLowerCase())
        );
        const filteredSellersString = this.vendedoresStringList.filter(
            (seller) => seller.toLowerCase().includes(value.toLowerCase())
        );
        this.filteredVendedoresStringList = filteredSellersString;
        this.filteredVendedoresObjects = filteredSellers;
    }

    onSellersSelectionChange(event) {
        //console.log(this.vendedores.value);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // Visitors
        // this.chartVisitors = {
        //     chart: {
        //         animations: {
        //             speed: 400,
        //             animateGradually: {
        //                 enabled: false,
        //             },
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         width: '100%',
        //         height: '100%',
        //         type: 'area',
        //         toolbar: {
        //             show: false,
        //         },
        //         zoom: {
        //             enabled: false,
        //         },
        //     },
        //     colors: ['#818CF8'],
        //     dataLabels: {
        //         enabled: false,
        //     },
        //     fill: {
        //         colors: ['#312E81'],
        //     },
        //     grid: {
        //         show: true,
        //         borderColor: '#334155',
        //         padding: {
        //             top: 10,
        //             bottom: -40,
        //             left: 0,
        //             right: 0,
        //         },
        //         position: 'back',
        //         xaxis: {
        //             lines: {
        //                 show: true,
        //             },
        //         },
        //     },
        //     series: this.data.visitors.series,
        //     stroke: {
        //         width: 2,
        //     },
        //     tooltip: {
        //         followCursor: true,
        //         theme: 'dark',
        //         x: {
        //             format: 'MMM dd, yyyy',
        //         },
        //         y: {
        //             formatter: (value: number): string => `${value}`,
        //         },
        //     },
        //     xaxis: {
        //         axisBorder: {
        //             show: false,
        //         },
        //         axisTicks: {
        //             show: false,
        //         },
        //         crosshairs: {
        //             stroke: {
        //                 color: '#475569',
        //                 dashArray: 0,
        //                 width: 2,
        //             },
        //         },
        //         labels: {
        //             offsetY: -20,
        //             style: {
        //                 colors: '#CBD5E1',
        //             },
        //         },
        //         tickAmount: 20,
        //         tooltip: {
        //             enabled: false,
        //         },
        //         type: 'datetime',
        //     },
        //     yaxis: {
        //         axisTicks: {
        //             show: false,
        //         },
        //         axisBorder: {
        //             show: false,
        //         },
        //         min: (min): number => min - 750,
        //         max: (max): number => max + 250,
        //         tickAmount: 5,
        //         show: false,
        //     },
        // };

        // Conversions
        // this.chartConversions = {
        //     chart: {
        //         animations: {
        //             enabled: false,
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'area',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#38BDF8'],
        //     fill: {
        //         colors: ['#38BDF8'],
        //         opacity: 0.5,
        //     },
        //     series: this.data.conversions.series,
        //     stroke: {
        //         curve: 'smooth',
        //     },
        //     tooltip: {
        //         followCursor: true,
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         type: 'category',
        //         categories: this.data.conversions.labels,
        //     },
        //     yaxis: {
        //         labels: {
        //             formatter: (val): string => val.toString(),
        //         },
        //     },
        // };

        // Impressions
        // this.chartImpressions = {
        //     chart: {
        //         animations: {
        //             enabled: false,
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'area',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#34D399'],
        //     fill: {
        //         colors: ['#34D399'],
        //         opacity: 0.5,
        //     },
        //     series: this.data.impressions.series,
        //     stroke: {
        //         curve: 'smooth',
        //     },
        //     tooltip: {
        //         followCursor: true,
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         type: 'category',
        //         categories: this.data.impressions.labels,
        //     },
        //     yaxis: {
        //         labels: {
        //             formatter: (val): string => val.toString(),
        //         },
        //     },
        // };

        // Visits
        // this.chartVisits = {
        //     chart: {
        //         animations: {
        //             enabled: false,
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'area',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#FB7185'],
        //     fill: {
        //         colors: ['#FB7185'],
        //         opacity: 0.5,
        //     },
        //     series: this.data.visits.series,
        //     stroke: {
        //         curve: 'smooth',
        //     },
        //     tooltip: {
        //         followCursor: true,
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         type: 'category',
        //         categories: this.data.visits.labels,
        //     },
        //     yaxis: {
        //         labels: {
        //             formatter: (val): string => val.toString(),
        //         },
        //     },
        // };

        // ROL vs ROL Realizada
        this.chartVisitorsVsPageViews = {
            chart: {
                animations: {
                    enabled: false,
                },
                locales: [
                    {
                        name: 'pt-br',
                        options: {
                            months: [
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
                            shortMonths: [
                                'Jan',
                                'Fev',
                                'Mar',
                                'Abr',
                                'Mai',
                                'Jun',
                                'Jul',
                                'Ago',
                                'Set',
                                'Out',
                                'Nov',
                                'Dez',
                            ],
                            days: [
                                'Domingo',
                                'Segunda',
                                'Terça',
                                'Quarta',
                                'Quinta',
                                'Sexta',
                                'Sábado',
                            ],
                            shortDays: [
                                'Dom',
                                'Seg',
                                'Ter',
                                'Qua',
                                'Qui',
                                'Sex',
                                'Sab',
                            ],
                            toolbar: {
                                exportToSVG: 'Baixar SVG',
                                exportToPNG: 'Baixar PNG',
                                exportToCSV: 'Baixar CSV',
                                menu: 'Menu',
                                selection: 'Selecionar',
                                selectionZoom: 'Selecionar Zoom',
                                zoomIn: 'Aumentar',
                                zoomOut: 'Diminuir',
                                pan: 'Navegação',
                                reset: 'Reiniciar Zoom',
                            },
                        },
                    },
                ],
                defaultLocale: 'pt-br',
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                stacked: false,
            },
            colors: ['#FF8C00', '#94A3B8'],
            dataLabels: {
                enabled: false,
            },
            fill: {
                colors: ['#64748B', '#94A3B8'],
                opacity: 0.5,
            },
            grid: {
                show: false,
                padding: {
                    bottom: -30,
                    left: 0,
                    right: 0,
                },
            },
            legend: {
                show: false,
            },
            series: this.data.visitorsVsPageViews.series,
            stroke: {
                curve: 'straight',
                width: 1,
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                x: {
                    format: 'dd MMM, yyyy',
                },
                y: {
                    formatter: function (value) {
                        return value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        });
                    },
                },
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                labels: {
                    offsetY: -20,
                    rotate: 0,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tickAmount: 3,
                tooltip: {
                    enabled: false,
                },
                type: 'datetime',
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                max: (max): number => max + 250,
                min: (min): number => min - 250,
                show: false,
                tickAmount: 5,
            },
        };

        // ROL vs Meta
        this.chartNewVsReturning = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FF8C00', '#F0E68C', '#FF4500'],
            labels: this.data.newVsReturning.labels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: this.data.newVsReturning.series,
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
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${
                                                        w.config.colors[
                                                            seriesIndex
                                                        ]
                                                    };"></div>
                                                    <div class="ml-2 text-md leading-none">${
                                                        w.config.labels[
                                                            seriesIndex
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
            },
        };

        // Metas Atingidas
        this.chartGender = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '90%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#008000', '#32CD32'],
            labels: this.data.gender.labels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: this.data.gender.series,
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
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                     <div class="w-3 h-3 rounded-full" style="background-color: ${
                                                         w.config.colors[
                                                             seriesIndex
                                                         ]
                                                     };"></div>
                                                     <div class="ml-2 text-md leading-none">${
                                                         w.config.labels[
                                                             seriesIndex
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
            },
        };

        // Dias Úteis
        this.chartAge = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '90%',
                type: 'radialBar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FF8C00', '#F0E68C'],
            labels: this.data.age.labels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: this.data.age.series,
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
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${
                                                        w.config.colors[
                                                            seriesIndex
                                                        ]
                                                    };"></div>
                                                    <div class="ml-2 text-md leading-none">${
                                                        w.config.labels[
                                                            seriesIndex
                                                        ]
                                                    }:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${(
                                                        (w.config.series[
                                                            seriesIndex
                                                        ] *
                                                            100) /
                                                        30
                                                    ).toFixed(2)}%</div>
                                                </div>`,
            },
        };

        // Language
        // this.chartLanguage = {
        //     chart: {
        //         animations: {
        //             speed: 400,
        //             animateGradually: {
        //                 enabled: false,
        //             },
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'donut',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#805AD5', '#B794F4'],
        //     labels: this.data.language.labels,
        //     plotOptions: {
        //         pie: {
        //             customScale: 0.9,
        //             expandOnClick: false,
        //             donut: {
        //                 size: '70%',
        //             },
        //         },
        //     },
        //     series: this.data.language.series,
        //     states: {
        //         hover: {
        //             filter: {
        //                 type: 'none',
        //             },
        //         },
        //         active: {
        //             filter: {
        //                 type: 'none',
        //             },
        //         },
        //     },
        //     tooltip: {
        //         enabled: true,
        //         fillSeriesColor: false,
        //         theme: 'dark',
        //         custom: ({
        //             seriesIndex,
        //             w,
        //         }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
        //                                             <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
        //                                             <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
        //                                             <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
        //                                         </div>`,
        //     },
        // };

        //CC vs Metas

        this.chartGithubIssues = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#FF8C00', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: this.data.githubIssues.labels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: this.data.githubIssues.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };
    }
}
