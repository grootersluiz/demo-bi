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
    chartAcumulado: ApexOptions;
    companiesLabels: string[] = [];
    comparativoSeries: { name: string; data: number[] }[] = [];
    chartGlobal: ApexOptions;
    globalSeries = [
        { name: 'Meta', type: 'area', data: [] },
        { name: 'Realizado', type: 'line', data: [] },
        { name: 'Dentro da Carteira', type: 'column', data: [] },
        { name: 'Fora da Carteira', type: 'column', data: [] },
    ];
    initialInd: string = 'POSITIVACAO';
    data: any;
    selectedCurve: string = 'Todas';
    selectedStates: string[] = ['Todos'];
    selectedIntel: string = 'Positivação';
    selectedPerson: string = 'PF/PJ';
    anualIntel: string = 'Positivação';
    selectedSortOption: string = 'Por filial';
    sortOptions: string[] = ['Ascendente', 'Descendente', 'Nome'];
    intelOptions: string[] = ['Positivação', 'ROL', 'LB', 'MB'];
    personOptions: string[] = ['PF/PJ', 'PF', 'PJ'];
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
    filiaisObjects: { id: number; name: string }[];
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

                // Trigger the change detection mechanism so that it updates the chart when filtering
                this._cdr.markForCheck();
            });

        // Get Companies Filter

        this._vendasService.filiaisData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.filiaisObjects = data.filiaisLista;
                this.filiaisStringList = this.filiaisObjects.map(
                    (item) => item.name
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

        //Tratamento Chart "Indicadores"

        this.prepareIndicatorsData(this.initialInd);

        // Tratamento Chart "Comparativo Anual"
        this._chartAcumuladoFormat(0);

        // Prepare the chart data
        this._prepareChartData(this.initialInd, this.anualIntel);

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

    // Function to generate dynamic colors
    generateDynamicColors(numColors) {
        const predefinedColors = [
            '#ed7b00',
            '#6e7a8a',
            '#edca00',
            '#016901',
            '#191970',
        ];
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(predefinedColors[i % predefinedColors.length]);
        }

        return colors;
    }

    onMenuPersonSelected(person: string) {
        this.selectedPerson = person;
    }

    onMenuCurveSelected(curve: string) {
        this.selectedCurve = curve;
    }

    onMenuStateSelected(state: string) {
        if (state != 'Todos' && this.selectedStates.length > 0) {
            this.selectedStates = this.selectedStates.filter(
                (item) => item !== 'Todos'
            );

            let stateExists = false;
            this.selectedStates.forEach((selectedState, index) => {
                if (selectedState === state) {
                    stateExists = true;
                    this.selectedStates.splice(index, 1);
                }
            });

            if (!stateExists) {
                this.selectedStates.push(state);
            }

            if (this.selectedStates.length == 0) {
                this.selectedStates = ['Todos'];
            }
        } else if (state == 'Todos') {
            this.selectedStates = ['Todos'];
        }
        this.isSelected(state);
    }

    isSelected(state: string): boolean {
        return this.selectedStates.indexOf(state) !== -1;
    }

    onMenuIntelSelected(intel: string) {
        this.selectedIntel = intel;
        this.initialInd = intel == 'Positivação' ? 'POSITIVACAO' : intel;
        this.prepareIndicatorsData(this.initialInd);
    }

    onSort(sortOption: string) {
        let temp = [];
        switch (sortOption) {
            case `Ascendente`:
                temp = this.comparativoSeries[0].data.map((_, index) => {
                    const seriesData = this.comparativoSeries.map(
                        (series) => series.data[index]
                    );
                    return {
                        company: this.companiesLabels[index],
                        seriesData: seriesData,
                    };
                });
                temp.sort((a, b) => a.seriesData[0] - b.seriesData[0]);
                this.comparativoSeries.forEach((series, seriesIndex) => {
                    series.data = temp.map(
                        (item) => item.seriesData[seriesIndex]
                    );
                });
                this.companiesLabels = temp.map((item) => item.company);
                break;

            case `Descendente`:
                temp = this.comparativoSeries[0].data.map((_, index) => {
                    const seriesData = this.comparativoSeries.map(
                        (series) => series.data[index]
                    );
                    return {
                        company: this.companiesLabels[index],
                        seriesData: seriesData,
                    };
                });
                temp.sort((a, b) => b.seriesData[0] - a.seriesData[0]);
                this.comparativoSeries.forEach((series, seriesIndex) => {
                    series.data = temp.map(
                        (item) => item.seriesData[seriesIndex]
                    );
                });
                this.companiesLabels = temp.map((item) => item.company);
                break;
            case 'Nome':
                temp = this.comparativoSeries[0].data.map((_, index) => {
                    const seriesData = this.comparativoSeries.map(
                        (series) => series.data[index]
                    );
                    return {
                        company: this.companiesLabels[index],
                        seriesData: seriesData,
                    };
                });
                temp.sort((a, b) =>
                    a.company
                        .toLowerCase()
                        .localeCompare(b.company.toLowerCase())
                );
                this.comparativoSeries.forEach((series, seriesIndex) => {
                    series.data = temp.map(
                        (item) => item.seriesData[seriesIndex]
                    );
                });
                this.companiesLabels = temp.map((item) => item.company);
                break;
        }

        this._prepareChartAcumulado(this.anualIntel);
    }

    onAnualIntelSelected(intel: string) {
        this.anualIntel = intel;
        const index = this.intelOptions.indexOf(intel);

        this._chartAcumuladoFormat(index);

        // Prepare the chart data
        this._prepareChartAcumulado(intel);
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
                .subscribe(() => {
                    this.prepareIndicatorsData(this.initialInd);
                    this._chartAcumuladoFormat(0);
                    this._prepareChartAcumulado(this.anualIntel);
                });
        }
    }

    // Tratamento Chart "Indicadores Mensais"
    prepareIndicatorsData(indicator: string) {
        this.globalSeries = [
            { name: 'Meta', type: 'area', data: [] },
            { name: 'Realizado', type: 'line', data: [] },
            { name: 'Dentro da Carteira', type: 'column', data: [] },
            { name: 'Fora da Carteira', type: 'column', data: [] },
        ];
        this.data.ccInd.forEach((item) => {
            const key = Object.keys(item)[0];

            item[key].series.forEach((serie) => {
                if (
                    serie.name.includes(indicator) &&
                    serie.name.includes('META')
                ) {
                    this.globalSeries[0].data.push(serie.data[0]);
                }
                if (
                    serie.name.includes(indicator) &&
                    serie.name.includes('TOTAL')
                ) {
                    this.globalSeries[1].data.push(serie.data[0]);
                }
                if (
                    serie.name.includes(indicator) &&
                    serie.name.includes('DC')
                ) {
                    this.globalSeries[2].data.push(serie.data[0]);
                }
                if (
                    serie.name.includes(indicator) &&
                    serie.name.includes('FC')
                ) {
                    this.globalSeries[3].data.push(serie.data[0]);
                }
            });
        });
        this._prepareChartGlobal(indicator);
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

    private _chartAcumuladoFormat(indicator: number) {
        this.companiesLabels = [];
        this.comparativoSeries = [];

        Object.keys(this.data.ccCompAnual).forEach((key) => {
            if (key != 'report') {
                this.companiesLabels.push(key);

                if (this.comparativoSeries.length == 0) {
                    this.data.ccCompAnual[key].labels.forEach((year) => {
                        this.comparativoSeries.push({ name: year, data: [] });
                    });
                }

                this.data.ccCompAnual[key].series[indicator].data.forEach(
                    (value, index) => {
                        this.comparativoSeries[index].data.push(
                            value.toFixed(2)
                        );
                    }
                );
            }
        });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */

    private _prepareChartAcumulado(ind: string): void {
        const getChartHeight = (length: number) => {
            const heights = [];
            const inicio = 140;
            const fim = 1400;
            const tamanhoArray = 23;
            const incremento = (fim - inicio) / (tamanhoArray - 1);

            // Preenchendo o array
            for (let i = 0; i < tamanhoArray; i++) {
                const numero = inicio + i * incremento;
                heights.push(numero);
            }

            if (length - 1 > heights.length - 1) {
                return 1400;
            } else {
                return heights[length - 1];
            }
        };

        // CC Comparativo Acumulado
        this.chartAcumulado = {
            series: this.comparativoSeries,
            chart: {
                type: 'bar',
                height: getChartHeight(this.companiesLabels.length),
                toolbar: {
                    show: false,
                },
            },
            legend: {
                position: 'top',
            },
            colors: this.generateDynamicColors(this.comparativoSeries.length),
            // '#edca00'
            plotOptions: {
                bar: {
                    borderRadius: 1,
                    horizontal: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: this.companiesLabels,
            },
            tooltip: {
                theme: 'dark',
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            if (ind == 'ROL' || ind == 'LB') {
                                return y.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                });
                            }
                            if (ind == 'MB') {
                                return `${y.toFixed(2)}%`;
                            }
                        }
                        return y.toLocaleString('pt-BR', {
                            style: 'decimal',
                            useGrouping: true,
                        });
                    },
                },
            },
        };
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */

    private _prepareChartGlobal(ind: string): void {
        //Chart Global
        this.chartGlobal = {
            series: this.globalSeries,
            chart: {
                height: 300,
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
            colors: ['#0FAF14', '#527DE2', '#FF8C00', '#94A3B8'],
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
                opacity: [0.7, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: 'vertical',
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100],
                },
            },
            labels: this.data.ccIndLabels,
            markers: {
                size: 0,
            },
            xaxis: {
                type: 'datetime',
            },
            yaxis: {
                min: 0,
                tickAmount: 5,
                labels: {
                    formatter: function (value) {
                        if (value) {
                            return value.toLocaleString('pt-BR', {
                                style: 'decimal',
                                maximumFractionDigits: 0,
                                minimumFractionDigits: 0,
                            });
                        }
                    },
                },
            },
            tooltip: {
                theme: 'dark',
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            if (ind == 'ROL' || ind == 'LB') {
                                return y.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                });
                            }
                            if (ind == 'MB') {
                                return `${y.toFixed(2)}%`;
                            }
                        }
                        return y.toLocaleString('pt-BR', {
                            style: 'decimal',
                            useGrouping: true,
                        });
                    },
                },
            },
        };
    }

    private _prepareChartData(ind: string, anualIntel: string): void {
        //Acumulado Anual
        this._prepareChartAcumulado(anualIntel);

        //Indicadores Mensais
        this._prepareChartGlobal(ind);
    }
}
