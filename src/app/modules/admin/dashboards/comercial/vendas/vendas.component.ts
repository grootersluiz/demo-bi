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
    chartCC: ApexOptions;
    chartByCurve: ApexOptions;
    chartAnual: ApexOptions;
    chartCCPosNeg: ApexOptions;
    chartCCEstados: ApexOptions;
    data: any;

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
        // Clientes Compradores

        this.chartCC = {
            series: [
                {
                    name: 'Dentro da carteira',
                    data: [
                        8107.85, 8128.0, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5,
                        8514.3, 8481.85, 8487.7, 8506.9, 8626.2,
                    ],
                },
                {
                    name: 'Fora da carteira',
                    data: [
                        8423.5, 8514.3, 8481.85, 8487.7, 8506.9, 8626.2,
                        8668.95, 8496.25, 8600.65, 8881.1, 9340.85, 8602.3,
                    ],
                },
            ],
            chart: {
                fontFamily: 'inherit',
                type: 'area',
                height: 220,
                zoom: {
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
            },
            colors: ['#FF8C00', '#94A3B8'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'straight',
                width: 1,
            },

            title: {
                text: 'CC por Faturamento',
                align: 'left',
            },
            subtitle: {
                text: 'Dentro/Fora da carteira',
                align: 'left',
            },
            labels: [
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
            xaxis: {
                type: 'category',
            },
            yaxis: {
                opposite: true,
            },
            legend: {
                horizontalAlign: 'left',
            },
        };

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
            title: {
                text: 'CC por Curva de Produto',
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
                    formatter: (val: number): string => `${val}`,
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

        //CC Anual

        this.chartAnual = {
            series: [
                {
                    name: 'C. Positivados DC',
                    data: [44, 55, 57],
                },
                {
                    name: 'C. Não Positivados DC',
                    data: [76, 85, 101],
                },
                {
                    name: 'C. Positivados FC',
                    data: [35, 41, 36],
                },
                {
                    name: 'C. Não Positivados FC',
                    data: [63, 60, 66],
                },
            ],
            chart: {
                type: 'bar',
                height: 220,
            },
            colors: ['#FF8C00', '#F0E68C', '#FF4500', '#94A3B8'],
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
            yaxis: {
                title: {
                    text: 'CC Anual',
                },
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

        //CC Dentro e Fora da Carteira

        this.chartCCPosNeg = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: 300,
                type: 'polarArea',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            labels: [
                'DC Positivados',
                'DC Não Positivados',
                'FC Positivados',
                'FC Não Positivados',
            ],
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings: {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series: [5248, 2547, 6874, 1234],
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: 2,
            },
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#FF8C00',
                    shadeIntensity: 0.75,
                    shadeTo: 'dark',
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        //CC Por estados

        this.chartCCEstados = {
            series: [
                {
                    name: 'Dentro da carteira',
                    data: [
                        15,
                        20,
                        25,
                        60,
                        65,
                        30,
                        35,
                        1,
                        5,
                        7,
                        12,
                        40,
                        45,
                        50,
                        55,
                        ,
                        120,
                        125,
                        70,
                        105,
                        110,
                        115,
                        75,
                        80,
                        85,
                        90,
                        95,
                        100,
                    ],
                },
                {
                    name: 'Fora da carteira',
                    data: [
                        2, 6, 8, 14, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66,
                        71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121, 126,
                    ],
                },
            ],
            chart: {
                type: 'bar',
                height: 300,
            },
            colors: ['#FF8C00', '#F0E68C'],
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
                categories: [
                    'AC', // Acre
                    'AL', // Alagoas
                    'AP', // Amapá
                    'AM', // Amazonas
                    'BA', // Bahia
                    'CE', // Ceará
                    'DF', // Distrito Federal
                    'ES', // Espírito Santo
                    'GO', // Goiás
                    'MA', // Maranhão
                    'MT', // Mato Grosso
                    'MS', // Mato Grosso do Sul
                    'MG', // Minas Gerais
                    'PA', // Pará
                    'PB', // Paraíba
                    'PR', // Paraná
                    'PE', // Pernambuco
                    'PI', // Piauí
                    'RJ', // Rio de Janeiro
                    'RN', // Rio Grande do Norte
                    'RS', // Rio Grande do Sul
                    'RO', // Rondônia
                    'RR', // Roraima
                    'SC', // Santa Catarina
                    'SP', // São Paulo
                    'SE', // Sergipe
                    'TO', // Tocantins
                ],
            },
            yaxis: {
                title: {
                    text: 'CC por Estado',
                },
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
    }
}
