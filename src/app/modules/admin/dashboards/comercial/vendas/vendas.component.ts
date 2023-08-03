import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { VendasDashService } from './vendas.service';
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
    selector: 'vendasdash',
    templateUrl: './vendas.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['../../../util/css/css.component.scss'],
})
export class VendasDashComponent implements OnInit {
    chartByCurve: ApexOptions;
    chartGlobal: ApexOptions;
    chartCCEstados: ApexOptions;
    data: any;
    selectedCurve: string = 'Todas';
    selectedState: string = 'Todos';
    selectedIntel: string = 'Positivação';
    intelOptions: string[] = ['Positivação', 'ROL', 'LB', 'MB'];
    curveOptions: string[] = ['Todas', 'A', 'B', 'C', 'N', 'Vazio'];
    stateOptions: string[] = [
        'Todos',
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
    ];

    // Filtros principais do dashboard

    filiais = new FormControl(this._vendasService.INITIAL_COMPANIES_IDS);
    filiaisObjects: { id: number; string: string }[];
    filiaisStringList: string[];
    allCompaniesSelected: boolean = false;

    vendedores = new FormControl(this._vendasService.INITIAL_SELLERS_IDS);
    selectedSellers = new FormControl([]);

    vendedoresObjects: { id: number; string: string }[];
    filteredVendedoresObjects: { id: number; string: string }[];
    vendedoresStringList: string[];
    filteredVendedoresStringList: string[];
    allSellersSelected: boolean = false;

    sellersSearchInput = new FormControl('');

    start = new FormControl<Date | null>(null);
    end = new FormControl<Date | null>(null);

    dataInicio = this._vendasService.INITIAL_INITIAL_DATE;
    dataFinal = this._vendasService.INITIAL_FINAL_DATE;
    convDataIni: Date;
    today = new Date();

    isChecked: boolean;
    isToggleOn: boolean;
    titulo: string = 'Vendas';
    subTitulo: string = 'Indicadores de Vendas';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _vendasService: VendasDashService,
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
        this._vendasService.data$
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
        this._vendasService.sellersData$
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

    onMenuCurveSelected(curve: string) {
        this.selectedCurve = curve;
    }

    onMenuStateSelected(state: string) {
        this.selectedState = state;
    }

    onMenuIntelSelected(intel: string) {
        this.selectedIntel = intel;
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
            this.filiais.setValue(this._vendasService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    selectAllSellers() {
        if (this.allSellersSelected || this.vendedoresObjects.length === 0) {
            this.vendedores.setValue(this._vendasService.INITIAL_SELLERS_IDS);
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
        this.vendedores.setValue(this._vendasService.INITIAL_SELLERS_IDS);
    }

    handleSellersFilterClick(dtIni, dtFin) {
        this._vendasService
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
            this.filiais.setValue(this._vendasService.INITIAL_COMPANIES_IDS);
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
            this.vendedores.setValue(this._vendasService.INITIAL_SELLERS_IDS);
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
            this._vendasService
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
        // CC por curva
        this.chartByCurve = {
            series: [
                {
                    name: 'Dentro da carteira',
                    data: [68, 100, 40, 30, 50],
                },
                {
                    name: 'Fora da carteira',
                    data: [26, 74, 26, 12, 37],
                },
            ],
            chart: {
                height: 430,
                type: 'radar',
            },
            dataLabels: {
                enabled: true,
            },
            plotOptions: {
                radar: {
                    size: 180,
                    polygons: {
                        fill: {
                            colors: ['#f8f8f8', '#fff'],
                        },
                    },
                },
            },

            colors: ['#FF8C00', '#94A3B8'],
            markers: {
                size: 4,
                colors: ['#FF8C00', '#94A3B8'],
                strokeColors: ['#FF4560'],
                strokeWidth: 2,
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: (
                        value: number,
                        { series, seriesIndex, dataPointIndex }
                    ): string => {
                        const percentage =
                            (value /
                                (series[
                                    seriesIndex == 0
                                        ? seriesIndex + 1
                                        : seriesIndex - 1
                                ][dataPointIndex] +
                                    value)) *
                            100;

                        return percentage.toFixed(2).toString() + '%';
                    },
                },
            },
            xaxis: {
                categories: ['A', 'B', 'C', 'N', 'Vazio'],
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (val: number): string => `${val}`,
                },
            },
        };

        this.chartGlobal = {
            series: [
                {
                    name: 'Meta',
                    type: 'area',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                    name: 'Total CC',
                    type: 'line',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
                {
                    name: 'Dentro da Carteira',
                    type: 'column',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                    name: 'Fora da Carteira',
                    type: 'column',
                    data: [7, 14, 14, 3, 32, 13, 27, 31, 15, 14, 9],
                },
            ],
            chart: {
                height: 250,
                type: 'line',
                stacked: false,
                toolbar: {
                    show: false,
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
            },
            colors: ['#0FAF14', '#527DE2', '#FEB013', '#B3B4B7'],
            stroke: {
                width: [1, 1, 3, 3],
                curve: 'smooth',
            },
            plotOptions: {
                bar: {
                    columnWidth: '30%',
                },
            },

            fill: {
                opacity: [0.3, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: 'vertical',
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100],
                },
            },
            labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
            ],
            markers: {
                size: 0,
            },
            xaxis: {
                type: 'datetime',
            },
            yaxis: {
                min: 0,
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            return y.toFixed(0);
                        }
                        return y;
                    },
                },
            },
        };
    }
}
