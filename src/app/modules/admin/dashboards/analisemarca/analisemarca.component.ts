import { Component, Injectable,  ViewChild, Inject} from '@angular/core';
import {ElementRef, Renderer2, LOCALE_ID } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogContainer} from '@angular/material/dialog';
import {Directive, OnInit, Output,Input, EventEmitter} from '@angular/core';
// import { formatNumber } from '@angular/common';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker, MatDatepickerToggle, MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as _moment from 'moment';
const moment = _rollupMoment || _moment;
import _, { isNumber } from 'lodash';

import { HttpClient } from '@angular/common/http';
import { AnalisemarcaService } from './analisemarca.service';
import { ColorsComponent } from '../../util/colors/colors.component';

import ApexCharts from "apexcharts"; //está usando
import { ApexOptions } from 'ng-apexcharts'; //está usando
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexResponsive,
  ApexYAxis
} from "ng-apexcharts";
import { values } from 'lodash';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  colors: any[];
  chart: ApexChart;
  fill: ApexFill;
  yaxis: ApexYAxis[];
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-analisemarca',
  templateUrl: './analisemarca.component.html',
  styleUrls: ['./analisemarca.component.scss','../../util/css/css.component.scss'],
})

@Injectable()
export class AnalisemarcaComponent {

  @ViewChild("chart") chart: ChartComponent;
  // @ViewChild("chart") _elChart: ElementRef;

  @ViewChild("containerFilter") _elFilter: ElementRef;
//   @ViewChild("containerForm") _elForm: ElementRef;
  @ViewChild("containerDash") _elDash: ElementRef;
  @ViewChild("idModal") _elidModal: ElementRef;

  public chartOptions: Partial<ChartOptions>;

  viewSerie = new Array();
  viewYAxis = new Array();


  animal: string;
  name: string;

  posicionaValorXinCategoria(categorias,rows){

    var keyX = 2;
    var codemp  = this.param.filial;
    var descemp = this.param.descFilial;

    var dataSerie= { name: '', data: [] , color:''};


    for (let iColumn = 1; iColumn < this.series.columns.length; iColumn++) {
        const element = this.series.columns[iColumn];

        let _yaxis = this._serviceChart.exibirAxis[iColumn-1].yAxisSerie;
        let _color = this._serviceChart.exibirAxis[iColumn-1].cor;

        dataSerie = { name: element, data: [] , color: _color};

        var iPeriodo = 0;
        for (let iRow = 0; iRow < rows.length; iRow++) { // Array do periodo

            let valorKey  = rows[iRow];
            let mesNumber = valorKey[0].substr(3,2);
            let mesChar = this.analisemarcaService.meses[Number(mesNumber)];

            while(mesChar != categorias[iPeriodo].substr(0,3)){ //Valida mês existe, se não set valor 0.

                dataSerie.data.push(0);
                iPeriodo++;

                if(iPeriodo > 11){ break;}
            }

            var valor = !rows[iRow][iColumn] ? 0 : rows[iRow][iColumn];

            if(mesChar == categorias[iPeriodo].substr(0,3)){
                dataSerie.data.push(valor);
            }

            iPeriodo++;

        }

        this.series.viewSerie.push(dataSerie);
        this._serviceChart.series.viewSerie.push(dataSerie);

        var arrayView =  this._serviceChart.exibirAxis;

        for (let index = 0; index < arrayView.length; index++){

            var obj = arrayView[index];

            if(obj.exibir == true){

                if(obj.name === dataSerie.name){
                    this.viewSerie.push(dataSerie);
                    this._serviceChart.viewSerie.push(dataSerie);
                }
            }

        }

    }

    // this.chartOptions.title.text =  " Dia ("+descemp+")";
    this.chartOptions.series = this.viewSerie;
    this.chartOptions.xaxis.categories = categorias;

    // Ajuste realizar reflow no chart //////////////////////////////////////////
    var chart = new ApexCharts(this.chart, this.chartOptions);
    /////////////////////////////////////////////////////////////////////////////

  }

  param = {
            mes: null,
            ano: null,
            ultDia:null,
            filial:null,
            descFilial: null,
            marca: null,
            fornecedor: null
          };

  validaParam(){

    this.param.ultDia     = this.analisemarcaService.param.ultDia;
    this.param.mes        = this.analisemarcaService.param.mes;
    this.param.ano        = this.analisemarcaService.param.ano;
    this.param.filial     = this.analisemarcaService.param.filial;
    this.param.descFilial = this.analisemarcaService.param.descFilial;
    this.param.marca      = this.analisemarcaService.param.marca;
    this.param.fornecedor = this.analisemarcaService.param.fornecedor;

    if(!this.param.ano){

      const sysDate = new Date();
      this.param.ultDia = ("00" + (sysDate.getDate()-1)).slice(-2); // dia atual -1
      this.param.mes    = ("00" + (sysDate.getMonth()+1)).slice(-2);
      this.param.ano    = sysDate.getFullYear();
    //   this.param.filial = 99;
    //   this.param.descFilial = 'REDE';

    }
  }

  categorias = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

  series = {columns: [], rows: [], viewSerie: []};
  getSeries(){

    var dia          = this.param.ultDia;
    var mes          = this.param.mes;
    var ano          = this.param.ano;
    var filiais      = this.param.filial;
    var marcas       = this.param.marca;
    var fornecedores = this.param.fornecedor;

    var link = 'http://api.portal.jspecas.com.br/v1/views/429/data?'; // Produção
    // var link = 'http://api.portal.jspecas.com.br/v1/views/516/data?';   // Teste

    this._httpClient.get<{columns: [], rows: []}>(link+'ano='+ano+'&mes='+mes
                                                    +'&dtref1=01'+mes+ano+'&dtref2='+dia+mes+ano
                                                    +'&filiais='+filiais
                                                    +'&marca='+marcas
                                                    +'&fornecedor='+fornecedores
                                                 )
                            .subscribe(dataresponse => {
                                 this.series.columns  = dataresponse.columns;
                                 this.series.rows     = dataresponse.rows;

                                //  this._serviceChart.series.columns  = dataresponse.columns;
                                //  this._serviceChart.series.rows     = dataresponse.rows;

                                 this.posicionaValorXinCategoria(this.categorias,this.series.rows);

                            });

  }

  limpar(){
    this.series = {columns: [], rows: [], viewSerie: []};
    this.categorias = new Array();
    this.viewSerie = new Array();

  }
  titulo: string = "Análise Marca";
  subTitulo: string;
  isToggleOn: boolean;
  _sysdate:string;
  _elementRef: any;
  _elementRenderer: any;
  _thishttpClient: any;
  _containerChart: any;
  _serviceChart: any;
  _chartWidth = '99%';
  _iconShowFilter: string       = 'toggle_off';
  _tolltip_ShowFIlter: string   = 'Off filtro';
  _classChart = 'grid rounded-2xl p-0 mt-0 mr-0 mb-0 ml-0';
  _classDashInicial: string[]   = ['flex','flex-row','h-full','w-full','p-0','sm:w-full','md:w-full','lg:w-full','xl:w-full','2xl:w-full','mt-0','mr-0','mb-0','ml-0','relative'];
  _classFilterInicial: string[] = ['flex','flex-row','h-0'   ,'w-0'   ,'p-0' ,'sm:h-0'    ,'md:h-0'    ,'lg:w-0'    ,'xl:w-0'    ,'2xl:w-0'    ,'mt-0','mr-0','mb-0','ml-0','corfiltro'];

//   _classContainerCenter: string[] = ['flex','flex-auto','w-full'];
  _exibirAxis: any;
  showFilter(thisEvent,elFilter,elForm,elDash) {

    // this._chartWidth = '99%';
    this._iconShowFilter      = this._iconShowFilter== 'toggle_on'? 'toggle_off' : 'toggle_on';
    this._tolltip_ShowFIlter  = this._tolltip_ShowFIlter== 'On filtro'? 'Off filtro' : 'On filtro';

    var pClassDash  = ['flex','flex-row','h-5/6','p-0','w-12/12','sm:w-12/12','md:w-12/12','lg:w-12/12','xl:w-12/12','2xl:w-12/12','mt-2','mr-0','mb-0','ml-0','relative'];
    var pClassFilter= ['flex','flex-auto','h-1/6','p-0','w-12/12','sm:w-12/12','md:w-12/12','lg:w-12/12','xl:w-12/12','2xl:w-12/12','mt-0','mr-2','mb-0','ml-0','corfiltro'];
    // this._classContainerCenter = ['flex','flex-auto','w-full'];

    if(elFilter.hidden == false){
      elFilter.hidden = true;
      elForm.hidden   = true;
      // this._chartWidth = '99%';
      pClassDash  = ['flex','flex-row','h-full','w-full','p-0','w-12/12','sm:w-12/12','md:w-12/12','lg:w-12/12','xl:w-12/12','2xl:w-12/12','mt-0','mr-0','mb-0','ml-0','relative'];
      pClassFilter= ['flex','flex-row','h-0'   ,'w-full','p-0','w-0'    ,'sm:h-0'    ,'md:h-0'    ,'lg:w-0'    ,'xl:w-0'    ,'2xl:w-0'    ,'mt-0','mr-0','mb-0','ml-0','corfiltro'];
    //   this._classContainerCenter = ['flex','flex-auto','w-full'];

    }else{
      elFilter.hidden = false;
      elForm.hidden   = false;
      // this._chartWidth = '83%';
    }

    this._classDashInicial    = pClassDash;
    this._classFilterInicial  = pClassFilter;

    // Ajuste realizar reflow no chart //////////////////////////////////////////
    var chart = new ApexCharts(this.chart, this.chartOptions);
    /////////////////////////////////////////////////////////////////////////////

  }

  showDash(thisEvent) {

    if(thisEvent.hidden){
      thisEvent.hidden = false;
    }else{
      thisEvent.hidden = true;
    }
  }

  end = new FormControl<any | null>(null);
  dataHoje: Date = new Date;
  setFinalMY(evMY: Moment, datepicker: MatDatepicker<Moment>, dataref: any) {
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
        let evMonthF = ("00" + (evMY.month())).slice(-2);
        let evUltDay = ("00" + (getLastDayOfMonth(evMY.year(),evMY.month()))).slice(-2);

            // this.vendafilialService.setParam(
            //     evUltDay,evMonthF,evYear,99,'REDE'
            // )
            this.end.setValue(
                new Date(
                    evMY.year(),
                    evMY.month(),
                    1
                )
            );
            this.formatDataMesAno2(dataref);
            datepicker.close();

    }

  public menuFilialChart(el): void {

    this.analisemarcaService.param.filial = el.srcElement.attributes[1].value ;

    this.param.filial     = el.srcElement.attributes[1].value ;
    this.param.descFilial = el.srcElement.innerText ;

    this.analisemarcaService.setParam(this.param.ultDia,this.param.mes, this.param.ano, this.param.filial, this.param.descFilial,this.param.marca,this.param.fornecedor);

    this.viewSerie = new Array();

    this.validaParam();
    this.posicionaValorXinCategoria(this.categorias,this.series.rows);

  }

  codEx = ['E1','E2','E3','E4','E5','E6','E7'];
  public mostraMenuFilial2Chart(el): void {

    if(!el){ return null;}

    for (let index = 0; index < this.codEx.length; index++) {

      var elMenuFiliais = document.getElementById('item'+this.codEx[index]);

      if(this.codEx[index] == el.srcElement.innerText ){

        if(elMenuFiliais.className == 'charts-menu2'){

          var classe ="charts-menu2 charts-menu-open";
          var classes = elMenuFiliais.className.split(' ');
          var getIndex = classes.indexOf(classe);

          if (getIndex === -1) {
            classes.push(classe);
            elMenuFiliais.className = classes.join(' ');
          }

        }
      } else{
        elMenuFiliais.className = "charts-menu2";
      }

    }

  }

//   _formatNumber: any;
  private dialogRef: any;
  /////////////////////////////////////// Construtor  ///////////////////////////////////////////////
  constructor(public analisemarcaService: AnalisemarcaService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient
              ,public dialog: MatDialog
              ,private _colors: ColorsComponent
              ,@Inject(LOCALE_ID) public locale: string){

    // this._formatNumber      = formatNumber;
    this._elementRef        = _element;
    this._elementRenderer   = _renderer;
    this._thishttpClient    = _httpClient;
    this._serviceChart      = analisemarcaService;
    this._exibirAxis        = analisemarcaService.exibirAxis;

    const sysDate = new Date();
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;
    this._sysdate  = '('+mes+'/'+sysDate.getFullYear() +')';
    this.subTitulo = this._sysdate;

    this.validaParam();

    analisemarcaService.getXaxis();
    this.categorias = analisemarcaService.xAxis;
    this.viewYAxis  = analisemarcaService.viewYAxis;

    this.getSeries();

    var iconFilial = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M226 896q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226 642q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226 388q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"/></svg>`;
    var styleMenu = `<style>
                      .charts-menu {
                        background: #fff;
                        position: absolute;
                        top: 100%;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        padding: 3px;
                        right: 10px;
                        opacity: 0;
                        min-width: 80px;
                        transition: .15s ease all;
                        pointer-events: none;
                      }

                      .charts-menu-open {
                          opacity: 1 !important;
                          pointer-events: all !important;
                          transition: .15s ease all;
                      }

                      .charts-menu-item {
                          padding: 6px 7px;
                          font-size: 12px;
                          cursor: pointer;
                      }
                      .charts-menu-item:hover {
                        box-shadow: inset -30px -30px 30px 30px #efefef;
                      }

                      .charts-menu2 {
                        background: #fff;
                        position: absolute;
                        top: 10px;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        padding: 1px;
                        right: 80px;
                        opacity: 0;
                        min-width: 80px;
                        transition: .15s ease all;
                        pointer-events: none;
                      }

                      .charts-menu-item2 {
                        padding: 6px 7px;
                        font-size: 12px;
                        cursor: pointer;
                      }
                      .charts-menu-item2:hover {
                        box-shadow: inset -30px -30px 30px 30px #efefef;
                      }

                    </style>`;

    this.chartOptions = {
      series: this.viewSerie,
      colors: this._colors.colors,
      chart: {
        animations: {
          enabled: false
        },
        width: this._chartWidth,
        height: '98%',
        type: "line",
        stacked: false,
        redrawOnWindowResize: true,
        redrawOnParentResize: true,
        toolbar:{
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: true,
            zoomin: true,
            zoomout: true,
            reset: true,
            pan: false,
            customIcons: [{
              icon: iconFilial + styleMenu +
                    `<div class="charts-menu" id="menuFilial">
                      <div class="charts-menu-item" nodeValue="99"> Indicadores </div>
                    </div>`,
              index: 0,
              title: 'Indicadores',
              class: 'apexcharts-menu-icon',
              click: function (chart, options, e) {

                var elemento = document.getElementById("menuFilial");

                if(elemento.className == 'charts-menu'){

                  var classe ="charts-menu charts-menu-open";
                  var classes = elemento.className.split(' ');
                  var getIndex = classes.indexOf(classe);

                  if (getIndex === -1) {
                    classes.push(classe);
                    elemento.className = classes.join(' ');
                  }

                }else{
                  elemento.className = "charts-menu";
                }
              }
            }]
          }
        }

      },
      dataLabels: {
        distributed: true,
        formatter: (val) => {

            if (Number(val) < 0 || Number(val) > 150) {
                return this.formatadorPts(val);
            } else if (val != 0) {
                return this.formatadorPtsPMV(val);
            } else {
                return val;
            }
        },
        enabled: true,
        style: {
            fontSize: '10px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: ['#ffffff']
        },
        background: {
            enabled: true,
            foreColor: '#000000',
        },
        dropShadow: {
            enabled: false,
            top: 5,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45
        }
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
            }
        },
    },
      stroke: {
        curve: "smooth",
        width: 2
      },
    //   title: {
    //     text: " Dia ("+this.param.descFilial+")",
    //     align: "left"
    //   },
      yaxis: this.viewYAxis ,
      xaxis: {
          type: 'category',
          categories: this.categorias
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

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

  ngAfterViewInit(): void {

    window['Apex'] = {

        chart: {
            events: {

              click: (event: any, chartContext?: any, config? :any): void => {

                switch (event.srcElement.className) {
                  case "charts-menu-item":

                    const dialogRef = this.dialog.open(AnalisemarcaDialogComponent);

                    var elIdDialog = document.getElementById('dialogIndicadores');

                    this._elementRenderer.listen(elIdDialog,"click", event => {this.onChangeDialog(null)});

                    break;
                  default:
                    break;
                }
              }
            }
        }
    };
  }


  formatDataMesAno(dataPicker) {

    if (!dataPicker.value){ return null}

    var mes = dataPicker.value._i.month;
    mes = ("00" + (mes+1)).slice(-2)
    var dataMes = '01/'+ mes + '/'+ dataPicker.value._i.year;
    dataPicker.targetElement.value = dataMes;

    return true;

  }

  formatDataMesAno2(dataPicker) {

    var value = dataPicker.value;

    if(value.length >= 8){
      var arrayData = value.split("/");

      if(arrayData.length ==1){
        dataPicker.value = '01/'+value.substr(2,2)+'/'+value.substr(4,4);

      }else{

        var mes =  ("00" + (arrayData[1])).slice(-2);
        var ano = arrayData[2];

        dataPicker.value = '01/'+mes+'/'+ano;
      }

    }
    return true;

  }

  consultavendafilial(_dtref,filial,marca,fornecedor ){

    if(!marca){
        marca = 'null';
    }
    if(!fornecedor){
        fornecedor = 'null';
    }

    if(filial.length == 1){
        if (filial[0]=='null'){
            filial = 99;
        }
    }

    this._chartWidth = '83%';

    var dtRef = _dtref;
    var arrayParam = new Array();

    arrayParam.push(dtRef);

    var dataSplit = arrayParam[0].split('/',3);
    this._sysdate = '('+dataSplit[1]+'/'+dataSplit[2]+')';
    const lastDay = new Date(dataSplit[2], dataSplit[1] , 0);
    const lastDayDate = lastDay.toLocaleDateString(); // ultimo dia do mês

    const sysDate = new Date();
    var dia = ("00" + (sysDate.getDate()-1)).slice(-2) ;
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;

    var dataref = lastDayDate;

    if(sysDate.getFullYear() == dataSplit[2] && mes == dataSplit[1]){ // Atualizar dia do mês atual
      dataref = dia + mes + sysDate.getFullYear();
    }
    var ano = dataSplit[2];
    mes = dataSplit[1];
    dia = lastDayDate.substring(0,2); // ultimo dia do mês

    if(_dtref){
        this.analisemarcaService.dt_ref = dataref;
    }

    this.analisemarcaService.setParam(dia,mes,ano,filial,'REDE',marca,fornecedor);
    this.limpar(); // viewSerie, categorias, series
    this.validaParam();

    this.analisemarcaService.getXaxis();
    this.categorias = this.analisemarcaService.xAxis;
    this.viewYAxis  = this.analisemarcaService.viewYAxis;

    this.getSeries();

  }

  onChangeDialog(evento){

        while(this._serviceChart.updateOrder){
            this._serviceChart.updateOrder = false;

            var vSeries = this._serviceChart.viewSerie;
            var vYAxis = this._serviceChart.viewYAxis;

            this.viewSerie = vSeries;
            this.chartOptions.series = vSeries;

            this.viewYAxis = vYAxis;
            this.chartOptions.yaxis = vYAxis;

            //// Ajuste realizar reflow no chart //////////////////////////////////////////
            // setTimeout(() => {
                //// Ajuste realizar reflow no chart //////////////////////////////////////
                var chart = new ApexCharts(this.chart, this.chartOptions);
            // }, 500);
            //////////////////////////////////////////////////////////////////////////////

        }


  }

}

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-analisemarcadialog',
    templateUrl: './analisemarcadialog.component.html',
  })

  @Injectable()
  export class AnalisemarcaDialogComponent implements OnInit {

    listaIndicadores = new Array();

    constructor(
        public dialogRef: MatDialogRef<AnalisemarcaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _myService : AnalisemarcaService
      ) {

        this.listaIndicadores = _myService.exibirAxis;

      }

    ngOnInit() {
    }

    onClickcheck(el) {

        this._myService.updateOrder = true;

        var arrayOrder = this._myService.showOrder ? this._myService.showOrder.split(',') : Array();
        var exibirAxisLength =  this._myService.exibirAxis.length;
        var dataSerie = Object();
        var objExibir = Object();

        if(el.srcElement.checked){ // se true

            for (let index = 0; index < exibirAxisLength; index++){

                objExibir =  this._myService.exibirAxis[index];

                if(objExibir.name === el.srcElement.value){

                    this._myService.showOrder += this._myService.showOrder ? ','+ el.srcElement.value : el.srcElement.value ;

                    dataSerie = this._myService.series.viewSerie[index];

                    this._myService.viewSerie.push(dataSerie);

                    this._myService.exibirAxis[index].exibir = el.srcElement.checked;

                    // this._myService.viewYAxis[index].show        = el.srcElement.checked;
                    // this._myService.viewYAxis[index].labels.show = el.srcElement.checked;
                }

            }

        }else{

            this._myService.showOrder = '';
            this._myService.viewSerie = [];
            var removido = '';

            // Atualizar Exibição novamente.
            for (let index = 0; index < exibirAxisLength; index++){

                objExibir =  this._myService.exibirAxis[index];

                for (let iOrder = 0; iOrder < arrayOrder.length; iOrder++) {
                    let value = arrayOrder[iOrder];

                    if(el.srcElement.checked == false && el.srcElement.value === value ){
                        removido = value;
                        if(objExibir.name === value){
                            this._myService.exibirAxis[index].exibir = el.srcElement.checked;
                            // this._myService.viewYAxis[index].show        = el.srcElement.checked;
                            // this._myService.viewYAxis[index].labels.show = el.srcElement.checked;
                        }

                    }else{

                        if(objExibir.name === value){

                            // Atualizar showOrder novamente.
                            this._myService.showOrder += this._myService.showOrder ? ','+ value : value ;

                            dataSerie = this._myService.series.viewSerie[index];

                            this._myService.viewSerie.push(dataSerie);

                            this._myService.exibirAxis[index].exibir     = true;
                            // this._myService.viewYAxis[index].show        = true;
                            // this._myService.viewYAxis[index].labels.show = true;
                        }

                    }

                }

            }
        }

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

  }

