import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { DreDashService } from './dre.service';
import { ApexOptions } from 'ng-apexcharts';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { default as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';

@Component({
    selector: 'dredash',
    templateUrl: './dre.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../../util/css/css.component.scss'],
})
export class DreDashComponent implements OnInit {
    chartAnual: ApexOptions;
    chartDespesas: ApexOptions;
    chartProjecao: ApexOptions;

    // Grafico Comparativo (Esquerda)

    chartAcumulado: ApexOptions;
    selectedIntel: string = 'ROL';
    intelOptions: string[] = ['ROL', 'LB', 'MB', 'EBITDA'];
    selectedSortOption: string = 'Por filial';
    sortOptions: string[] = ['Ascendente', 'Descendente', 'Por filial'];
    data: any;

    // Filtros principais do dashboard

    filiais = new FormControl(this._dreService.INITIAL_COMPANIES_IDS);
    filiaisObjects: { id: number; string: string }[];
    filiaisStringList: string[];
    allCompaniesSelected: boolean = false;

    vendedores = new FormControl(this._dreService.INITIAL_SELLERS_IDS);
    selectedSellers = new FormControl([]);

    vendedoresObjects: { id: number; string: string }[];
    filteredVendedoresObjects: { id: number; string: string }[];
    vendedoresStringList: string[];
    filteredVendedoresStringList: string[];
    allSellersSelected: boolean = false;

    sellersSearchInput = new FormControl('');

    start = new FormControl<Date | null>(null);
    end = new FormControl<Date | null>(null);

    dataInicio = this._dreService.INITIAL_INITIAL_DATE;
    dataFinal = this._dreService.INITIAL_FINAL_DATE;
    convDataIni: Date;
    today = new Date();

    isChecked: boolean;
    isToggleOn: boolean;
    titulo: string = 'DRE';
    subTitulo: string = 'Resultados';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _dreService: DreDashService,
        private _router: Router,
        private _cdr: ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this._dreService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
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
        this._dreService.sellersData$
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

    onSort(sortOption: string) {
        this.selectedSortOption = sortOption;
        console.log('sort')

    }

    onMenuIntelSelected(intel: string) {
        this.selectedIntel = intel;
        console.log('intel')
    }

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

        // Get the current date
        let currentDate = new Date();

        // Extract the current year and month (0-based index)
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        // Extract the year and month from the given evMY
        let evYear = evMY.year();
        let evMonth = evMY.month();

        if (evYear === currentYear && evMonth === currentMonth) {
            // The given year and month match the current date
            // Return the current day
            this.dataFinal = {
                year: evMY.year(),
                month: evMY.month(),
                date: currentDate.getDate(),
            };
            this.end.setValue(
                new Date(
                    this.dataFinal.year,
                    this.dataFinal.month,
                    currentDate.getDate()
                )
            );

            datepicker.close();
        } else {
            // The given year and month do not match the current date
            // Continue with the existing functionality to get the last day of the month
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
    }

    resetDateInputs(): void {
        this.start.setValue(null);
        this.end.setValue(null);
    }

    selectAllCompanies() {
        if (!this.allCompaniesSelected) {
            let newFiliais = this.filiaisObjects.map((item) =>
                item.id.toString()
            );
            this.filiais.setValue(newFiliais);
            this.allCompaniesSelected = true;
        } else {
            this.filiais.setValue(this._dreService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    selectAllSellers() {
        if (this.allSellersSelected || this.vendedoresObjects.length === 0) {
            this.vendedores.setValue(this._dreService.INITIAL_SELLERS_IDS);
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

    handleDatePickerClick(
        event: Event,
        pickerToggle: MatDatepickerToggle<Date>
    ) {
        // Makes DatePicker open by clicking anywhere in the input
        pickerToggle._open(event);
    }

    handleCompaniesFilterClick(dtIni, dtFin) {
        this.vendedores.setValue(this._dreService.INITIAL_SELLERS_IDS);
    }

    handleSellersFilterClick(dtIni, dtFin) {
        this._dreService
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
            this.filiais.setValue(this._dreService.INITIAL_COMPANIES_IDS);
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
            this.vendedores.setValue(this._dreService.INITIAL_SELLERS_IDS);
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
            this._dreService
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
        //Chart Anual

        this.chartAnual = {
            series: [
                {
                    name: 'ROL',
                    data: [44, 55, 57],
                },
                {
                    name: 'Lucro Bruto',
                    data: [76, 85, 101],
                },
                {
                    name: 'EBITDA',
                    data: [63, 60, 66],
                },
            ],
            chart: {
                type: 'bar',
                height: 200,
                toolbar: {
                    show: false,
                },
            },
            colors: ['#FF8C00', '#F0E68C', '#94A3B8'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: ['2021', '2022', '2023'],
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val.toString();
                    },
                },
            },
        };

        //Acumulado Anual

        this.chartAcumulado = {
            series: [
                {
                    name: '2023',
                    data: [
                        580, 690, 1100, 1200, 1380, 400, 430, 448, 470, 540,
                        580, 690, 1100, 1200, 1380, 400, 430, 448, 470, 540,
                    ],
                },
                {
                    name: '2022',
                    data: [
                        1380, 400, 430, 448, 470, 540, 580, 690, 1100, 1200,
                        580, 690, 1100, 1200, 1380, 400, 430, 448, 470, 540,
                    ],
                },
                {
                    name: '2021',
                    data: [
                        580, 690, 1100, 1200, 1380, 400, 430, 448, 470, 540,
                        1380, 400, 430, 448, 470, 540, 580, 690, 1100, 1200,
                    ],
                },
            ],
            chart: {
                type: 'bar',
                height: 800,
                toolbar: {
                    show: false,
                },
            },
            legend: {
                position: 'top',
            },
            colors: ['#FF8C00', '#94A3B8', '#F0E68C'],
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: [
                    'Filial 1',
                    'Filial 2',
                    'Filial 3',
                    'Filial 4',
                    'Filial 5',
                    'Filial 6',
                    'Filial 7',
                    'Filial 8',
                    'Filial 9',
                    'Filial 10',
                    'Filial 11',
                    'Filial 12',
                    'Filial 13',
                    'Filial 14',
                    'Filial 15',
                    'Filial 16',
                    'Filial 17',
                    'Filial 18',
                    'Filial 19',
                    'Filial 20',
                ],
            },
            yaxis: {
                title: {
                    text: 'Acumulado Filiais',
                },
            },
        };

        //Chart Anual Despesas

        this.chartDespesas = {
            series: [
                {
                    name: 'ROL',
                    data: [78, 84, 75],
                },
                {
                    name: 'Despesas Variáveis',
                    data: [35, 41, 36],
                },
                {
                    name: 'Despesas Operacionais',
                    data: [63, 60, 66],
                },
            ],
            chart: {
                type: 'area',
                height: 200,
                toolbar: {
                    show: false,
                },
            },
            colors: ['#008000', '#FF8C00', '#94A3B8'],
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: '55%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            xaxis: {
                categories: ['2021', '2022', '2023'],
            },
            fill: {
                colors: ['#008000', '#FF8C00', '#94A3B8'],
                opacity: 0.4,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val.toString();
                    },
                },
            },
        };

        //Chart Projeção

        this.chartProjecao = {
            series: [
                {
                    name: 'ROL',
                    data: [78, 84, 75],
                },
                {
                    name: 'Despesas Variáveis',
                    data: [35, 41, 36],
                },
                {
                    name: 'Despesas Operacionais',
                    data: [63, 60, 66],
                },
            ],
            chart: {
                type: 'area',
                height: 200,
                toolbar: {
                    show: false,
                },
            },
            colors: ['#008000', '#FF8C00', '#94A3B8'],
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: '55%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            xaxis: {
                categories: ['2021', '2022', '2023'],
            },
            fill: {
                colors: ['#008000', '#FF8C00', '#94A3B8'],
                opacity: 0.4,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val.toString();
                    },
                },
            },
        };
    }
}
