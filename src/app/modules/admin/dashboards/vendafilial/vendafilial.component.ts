import { Component, Injectable, TemplateRef, ViewChild} from '@angular/core';
import { VendafilialService } from './vendafilial.service';
import { Observable, async } from 'rxjs';

import { Subject, takeUntil } from 'rxjs';

import { formatNumber } from '@angular/common';
import { LocalizedString, parseTemplate } from '@angular/compiler';
import {
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { template, toPlainObject } from 'lodash';
// import { VendafilialchartComponent } from './vendafilialchart/vendafilialchart.component';
// import { VendafilialchartService } from './vendafilialchart/vendafilialchart.service';
import { FormControl } from '@angular/forms';
import ApexCharts from "apexcharts"; //está usando
import { ApexOptions } from 'ng-apexcharts';
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

import { default as _rollupMoment, Moment } from 'moment';

import * as _moment from 'moment';

const moment = _rollupMoment || _moment;


export interface TipoColumaElement {
  NOMEFANTASIA: string;
  METAROL: number;
  REALROL: number;
  REALROLINTERCOMP: number;
  REALROLREGULAR: number;
  REALROLINSUMO: number;
  REALROLTOTAL: number;
  PROJECAO: number;
  ATINGMETAROL: number;
  GAPMETAROL: number;
  METAVDROL: number;
  REALVDROL: number;
  DIFMETAROL: number;
  NOVAMETAROL: number;
  METAMB: number;
  REALMB: number;
  DIFMB: number;
  METALB: number;
  REALLB: number;
  PROJECAOLB: number;
  ATINGMETALB: number;
  GAPMETALB: number;
  METAPMV: number;
  REALPMV: number;
  DIFPMV: number;
  METACC: number;
  REALCC: number;
  DIFCC: number;
}

let ELEMENT_DATA_VENDA: TipoColumaElement[];

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  yaxis: ApexYAxis[];
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-vendafilial',
  templateUrl: './vendafilial.component.html',
  styleUrls: ['./vendafilial.component.scss'],
  // providers: [VendafilialchartComponent]
})

@Injectable()
export class VendafilialComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  end = new FormControl<any | null>(null);
  dataHoje: Date;

  _colors = {
    palette1:  ['#008FFB','#00E396','#FEB019','#FF4560','#775DD0'],
    palette2:  ['#3F51B5','#03A9F4','#4CAF50','#F9CE1D','#FF9800'],
    palette3:  ['#33B2DF','#546E7A','#D4526E','#13D8AA','#A5978B'],
    palette4:  ['#4ECDC4','#C7F464','#81D4FA','#546E7A','#FD6A6A'],
    palette5:  ['#2B908F','#F9A3A4','#90EE7E','#FA4443','#69D2E7'],
    palette6:  ['#449DD1','#F86624','#EA3546','#662E9B','#C5D86D'],
    palette7:  ['#D7263D','#1B998B','#2E294E','#F46036','#E2C044'],
    palette8:  ['#662E9B','#F86624','#F9C80E','#EA3546','#43BCCD'],
    palette9:  ['#5C4742','#A5978B','#8D5B4C','#5A2A27','#C4BBAF'],
    palette10: ['#A300D6','#7D02EB','#5653FE','#2983FF','#00B1F2']
  };

  viewSerie = [
    {
      name: "META",
      data: [],
      yAxis:0
    },
    {
      name: "ROL",
      data: [],
      yAxis:0
    },
    {
      name: "MB",
      data: [],
      yAxis: 2
    }
  ];
  posicionaValorXinCategoria(categorias,rows){

    var keyX = 2;
    var codemp  = this.param.filial;
    var descemp = this.param.descFilial;
    const dataAtual = new Date();
    dataAtual.setMonth(this.param.mes);
    dataAtual.setFullYear(this.param.ano);

    var indexData = 0;
    for (let index = 0; index < rows.length; index++) {

        if(rows[index][0] == codemp){

            var valorKey  = rows[index];
            dataAtual.setDate(valorKey[1].substr(0,2));

            var valorMeta = !rows[index][3]?0:rows[index][3];
            var valorRol  = !rows[index][4]?0:rows[index][4];
            var valorMb   = !rows[index][10]?0:rows[index][10];
//console.log(valorKey[1].substr(0,2) , categorias[indexData]);
                if(valorKey[1].substr(0,2) === categorias[indexData]){
                //  console.log('entrou',valorKey);
                    this.viewSerie[0].data.push(valorMeta);
                    this.viewSerie[1].data.push(valorRol);
                    this.viewSerie[2].data.push(valorMb);
                }
            else{
                if(valorKey[1].substr(0,2) < categorias[indexData]){
                    indexData--;
                }
            }
            indexData++;
        }


    }

    this.chartOptions.title.text =  " Dia ("+descemp+")";
    this.chartOptions.series = this.viewSerie;
    this.chartOptions.xaxis.categories = categorias;

  }

  param = {
            mes: null,
            ano: null,
            ultDia:null,
            filial:null,
            descFilial: null
          };

  validaParam(){

    // var chartService = new VendafilialchartService() ;
    // this.param = chartService.param;
    this.param.ultDia     = this.vendafilialService.param.ultDia;
    this.param.mes        = this.vendafilialService.param.mes;
    this.param.ano        = this.vendafilialService.param.ano;
    this.param.filial     = this.vendafilialService.param.filial;
    this.param.descFilial = this.vendafilialService.param.descFilial;

    if(!this.param.ano){

      const sysDate = new Date();
      this.param.ultDia = ("00" + (sysDate.getDate()-1)).slice(-2); // dia atual -1
      this.param.mes    = ("00" + (sysDate.getMonth()+1)).slice(-2);
      this.param.ano    = sysDate.getFullYear();
      this.param.filial = 99;
      this.param.descFilial = 'REDE';

    }
  }

//    setParam(ultDia,mes, ano){

//      this.param.ultDia = 1;
//      this.param.mes    = mes;
//      this.param.ano    = ano;
//      this.param.ultDia = ultDia;
//    }

  categorias = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30','31'];
  getCategorias(){

    var dia = parseInt(this.param.ultDia);
    var mes = parseInt(this.param.mes);
    var ano = parseInt(this.param.ano);
    const dataAtual = new Date();
    dataAtual.setMonth(this.param.mes-1);
    dataAtual.setFullYear(this.param.ano);



    // this.categorias = [];
        this.categorias = [];
        var contDia: string;
        for (let index = 1 ; index <= dia; index++) {
         dataAtual.setDate(index);
         if(dataAtual.getDay() != 0){

            contDia = ("00" + index).slice(-2) ;

            this.categorias.push(contDia);}
         }

         var chartService = new ApexCharts(this.chart, this.chartOptions) ;
  }

  series = {columns: [], rows: []};
  getSeries(){

    var dia = this.param.ultDia;
    var mes = this.param.mes;
    var ano = this.param.ano;

    this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/329/data?ano='+ano+'&mes='+mes+'&dtref1=01'+mes+ano+'&dtref2='+dia+mes+ano)
                            .subscribe(dataresponse => {
                                 this.series.columns  = dataresponse.columns;
                                 this.series.rows     = dataresponse.rows;
                                 this.getCategorias();
                                 this.posicionaValorXinCategoria(this.categorias,this.series.rows);
                            });

  }

  limpar(){
    this.series = {columns: [], rows: []};
    this.categorias = new Array();
    this.viewSerie = [
      {
        name: "META",
        data: [],
        yAxis:0
      },
      {
        name: "ROL",
        data: [],
        yAxis:0
      },
      {
        name: "MB",
        data: [],
        yAxis: 1
      }
    ];

  }

  cabecalho: string[] = [ 'NOMEFANTASIA'
                        , 'METAROL'
                        , 'REALROL'
                        , 'REALROLINTERCOMP'
                        , 'REALROLREGULAR'
                        , 'REALROLINSUMO'
                        , 'REALROLTOTAL'
                        , 'PROJECAO'
                        , 'ATINGMETAROL'
                        , 'GAPMETAROL'
                        , 'METAVDROL'
                        , 'REALVDROL'
                        , 'DIFMETAROL'
                        , 'NOVAMETAROL'
                        , 'METAMB'
                        , 'REALMB'
                        , 'DIFMB'
                        , 'METALB'
                        , 'REALLB'
                        , 'PROJECAOLB'
                        , 'ATINGMETALB'
                        , 'GAPMETALB'
                        , 'METAPMV'
                        , 'REALPMV'
                        , 'DIFPMV'
                        , 'METACC'
                        , 'REALCC'
                        , 'DIFCC'
                      ];

  dataSource = ELEMENT_DATA_VENDA;
  _sysdate:string;


  _elementFilter: any;
  _elementRenderer: any;
  _thishttpClient: any;
  _containerChart: any;
  _serviceChart: any;

  formataDataSource(lista){

    var dataSourceVendaElemente ;
    var arrayTeste = [];

    var basecolor = "inline-flex items-center px-2.5 rounded-full text-xs font-bold"
    var red = "bg-red-200 dark:bg-red-600 dark:text-red-50 text-red-800 " + basecolor;
    var orange = "bg-orange-200 dark:bg-orange-600 dark:text-orange-50 text-orange-800 "+ basecolor;
    var green = "bg-green-200 dark:bg-green-600 dark:text-green-50 text-green-800 "+ basecolor;

    for (var i =0; i < lista.length; i++) {

      dataSourceVendaElemente = {
                  NOMEFANTASIA:       lista[i][0],
                  METAROL:            lista[i][1],
                  REALROL:            lista[i][2],
                  REALROLINTERCOMP:   lista[i][3],
                  REALROLREGULAR:     lista[i][4],
                  REALROLINSUMO:      lista[i][5],
                  REALROLTOTAL:       lista[i][6],
                  PROJECAO:           lista[i][7],
                  ATINGMETAROL:       lista[i][8],
                  colorATINGMETAROL:  lista[i][8]< 90? red : lista[i][8]>90 && lista[i][8]<100? orange : green ,
                  GAPMETAROL:         lista[i][9],
                  colorGAPMETAROL:    lista[i][9] > 0 ? green: red,
                  METAVDROL:          lista[i][10],
                  REALVDROL:          lista[i][11],
                  DIFMETAROL:         lista[i][12],
                  colorDIFMETAROL:    lista[i][12] > 0 ? green: red,
                  NOVAMETAROL:        lista[i][13],
                  METAMB:             lista[i][14],
                  REALMB:             lista[i][15],
                  DIFMB:              lista[i][16],
                  colorDIFMB:         lista[i][16] > 0 ? green: red,
                  METALB:             lista[i][17],
                  REALLB:             lista[i][18],
                  PROJECAOLB:         lista[i][19],
                  ATINGMETALB:        lista[i][20],
                  colorATINGMETALB:   lista[i][20]< 90? red : lista[i][20]>90 && lista[i][20]<100? orange : green ,
                  GAPMETALB:          lista[i][21],
                  colorGAPMETALB:     lista[i][21] > 0 ? green: red,
                  METAPMV:            lista[i][22],
                  REALPMV:            lista[i][23],
                  DIFPMV:             lista[i][24],
                  colorDIFPMV:        lista[i][24] > 0 ? red : green,
                  METACC:             lista[i][25],
                  REALCC:             lista[i][26],
                  DIFCC:              lista[i][27],
                  colorDIFCC:         lista[i][27] > 0 ? green: red
                };

        arrayTeste.push(dataSourceVendaElemente);
    }

    return arrayTeste;

  }

  isToggleOn: boolean;
  _iconShowFilter: string       = 'filter_list';
  _tolltip_ShowFIlter: string   = 'On filtro';
  _classDashInicial: string[]   = ['flex','flex-col','p-0','w-full','sm:w-full','md:w-full','lg:w-full','xl:w-full','2xl:w-full'];
  _classFilterInicial: string[] = ['flex','flex-col','p-0','w-full','sm:h-full','md:h-full','lg:w-full','xl:w-full','2xl:w-full'];


  showFilter(thisEvent) {

    this._iconShowFilter      = this._iconShowFilter== 'filter_list'? 'filter_list_off' : 'filter_list';
    this._tolltip_ShowFIlter  = this._tolltip_ShowFIlter== 'On filtro'? 'Off filtro' : 'On filtro';

    var filterHidden = this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild.style.visibility ;

    if(filterHidden == 'hidden'){
      filterHidden = 'visible';
      var pClassDash    = this._classDashInicial;
      var pClassFilter  = this._classFilterInicial;
    }else{
      filterHidden = 'hidden';

      var pClassDash  = ['flex','flex-col','p-0','w-full','sm:w-full','md:w-full','lg:w-full','xl:w-full','2xl:w-full'];
      var pClassFilter= ['flex','flex-col','p-0','w-0'   ,'sm:h-0'   ,'md:h-0'   ,'lg:w-0'   ,'xl:w-0'   ,'2xl:w-0'];
    }

    this._elementRenderer.setStyle(
      this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,
      'visibility',filterHidden
    );

    let classDashAtual    = this._elementFilter.nativeElement.firstElementChild.lastElementChild.lastElementChild.classList;
    let classFilterAtual  = this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild.classList;

    var array1 = new Array();
    var array2 = new Array();
    for (let index = 0; index < classDashAtual.length; index++) {
      const iDash   = classDashAtual[index];
      const iFilter = classFilterAtual[index];

      array1.push(iDash);
      array2.push(iFilter);

    }

    for (var index = 0; index < array1.length; index++) {
      const iDash   = array1[index];
      const iFilter = array2[index];

      this._elementRenderer.removeClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.lastElementChild,iDash);
      this._elementRenderer.removeClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,iFilter);

    }

    for (let index = 0; index < pClassDash.length; index++) {
      const iDash   = pClassDash[index];
      const iFilter = pClassFilter[index];

      this._elementRenderer.addClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.lastElementChild,iDash);
      this._elementRenderer.addClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,iFilter);

    }

    return true;

  }
  showDash(thisEvent) {

    if(thisEvent.hidden){
      thisEvent.hidden = false;
    }else{
      thisEvent.hidden = true;
    }
  }

  public menuFilialChart(el): void {

    // this.vendafilialService.param.filial = el.srcElement.attributes[1].value ;

    this.param.filial     = el.srcElement.attributes[1].value ;
    this.param.descFilial = el.srcElement.innerText ;

    this.vendafilialService.setParam(this.param.ultDia,this.param.mes, this.param.ano, this.param.filial, this.param.descFilial );

    this.viewSerie = [
      {
        name: "META",
        data: [],
        yAxis:0
      },
      {
        name: "ROL",
        data: [],
        yAxis:0
      },
      {
        name: "MB",
        data: [],
        yAxis: 2
      }
    ];

    this.validaParam();
    this.posicionaValorXinCategoria(this.categorias,this.series.rows);

  }



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




  // codEx = [100,200,300,400,500,600,700];
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

  /////////////////////////////////////// Construtor  ///////////////////////////////////////////////
  constructor(private vendafilialService: VendafilialService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient){

    this._elementFilter     = _element;
    this._elementRenderer   = _renderer;
    this._thishttpClient    = _httpClient;
    this.dataHoje = new Date();

    const sysDate = new Date();
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;
    this._sysdate  = '('+mes+'/'+sysDate.getFullYear() +')';
    var lista = this.vendafilialService.data$[1];

    var arrayDataSource =  this.formataDataSource(lista);

    this.dataSource = arrayDataSource;

    //Ajuste para renderizar class
    setTimeout(() => {
      this._elementRenderer.setStyle(
        this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,
        'visibility','hidden'
      );
      this.showFilter('');
    }, 500);

    this.validaParam();
    // this.getCategorias();
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

                        div.cabecalho-filtro {
                            background: rgb(75, 75, 75);
                            background: linear-gradient(
                                0deg,
                                rgba(75, 75, 75, 1) 0%,
                                rgba(82, 82, 82, 1) 12%,
                                rgba(82, 82, 82, 1) 86%,
                                rgba(75, 75, 75, 1) 100%
                            );
                            filter: drop-shadow(0 0.4rem 0.7rem #00000065);
                            border-radius: 15px;
                            height: 120px;
                            padding-bottom: 1rem;
                        }

                        .cabecalho-filtro div.mat-mdc-form-field-flex {
                            background-color: rgb(179, 179, 179);
                            filter: drop-shadow(0 0.4rem 0.7rem #00000065);
                        }

                        .cabecalho-filtro svg.mat-datepicker-toggle-default-icon {
                            color: #525252;
                        }

                        .cabecalho-filtro .logo-filter {
                            width: 4rem;
                            height: 4rem;
                        }

                        .cabecalho-filtro .apply-button {
                            filter: drop-shadow(0 0.4rem 0.7rem #00000065);
                            transition: filter 150ms;
                        }

                        .cabecalho-filtro .apply-button:hover {
                            filter: drop-shadow(0 0 0.2rem #d8790c59);
                        }
                    </style>`;

    this.chartOptions = {
      series: this.viewSerie,
      chart: {
        width: "100%",
        height: '100%',
        type: "area",
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
                      <div class="charts-menu-item" value="99"> REDE </div>
                      <div class="charts-menu-item" value="100">E1</div>
                        <div class="charts-menu2" id="itemE1">
                          <div class="charts-menu-item2" value="10">BH</div>
                          <div class="charts-menu-item2" value="22">GO</div>
                          <div class="charts-menu-item2" value="23">RJ</div>
                          <div class="charts-menu-item2" value="24">JF</div>
                        </div>
                      <div class="charts-menu-item" value="200">E2</div>
                        <div class="charts-menu2" id="itemE2">
                          <div class="charts-menu-item2" value="3">CB</div>
                          <div class="charts-menu-item2" value="13">SN</div>
                          <div class="charts-menu-item2" value="28">CBE</div>
                        </div>
                      <div class="charts-menu-item" value="300">E3</div>
                        <div class="charts-menu2" id="itemE3">
                          <div class="charts-menu-item2" value="2">BL</div>
                          <div class="charts-menu-item2" value="14">MB</div>
                          <div class="charts-menu-item2" value="18">MP</div>
                        </div>
                      <div class="charts-menu-item" value="400">E4</div>
                        <div class="charts-menu2" id="itemE4">
                          <div class="charts-menu-item2" value="5">SL</div>
                          <div class="charts-menu-item2" value="6">TE</div>
                          <div class="charts-menu-item2" value="17">IM</div>
                        </div>
                      <div class="charts-menu-item" value="500">E5</div>
                        <div class="charts-menu2" id="itemE5">
                          <div class="charts-menu-item2" value="11">JP</div>
                          <div class="charts-menu-item2" value="15">CG</div>
                          <div class="charts-menu-item2" value="20">MC</div>
                          <div class="charts-menu-item2" value="21">RE</div>
                        </div>
                      <div class="charts-menu-item" value="600">E6</div>
                        <div class="charts-menu2" id="itemE6">
                          <div class="charts-menu-item2" value="7">SA</div>
                          <div class="charts-menu-item2" value="12">AR</div>
                          <div class="charts-menu-item2" value="19">VC</div>
                        </div>
                      <div class="charts-menu-item" value="700">E7</div>
                      <div class="charts-menu2" id="itemE7">
                        <div class="charts-menu-item2" value="8">FZ</div>
                        <div class="charts-menu-item2" value="9">NA</div>
                        <div class="charts-menu-item2" value="16">JN</div>
                      </div>
                    </div>`,
              index: 0,
              title: 'Filiais',
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
        enabled: false
      },
      tooltip: {
        enabled: true,
        y: {
            formatter: function (val) {
                var valor = val? Number(val).toFixed(2) : '0.00';

                valor = valor.replace('.',',');

                // if(valor.indexOf(",00") == -1)
                if(Number((valor.length)) > 6 && Number(valor.length) < 10){
                    var leng = valor.length;
                    valor = valor.substring(0,leng-6)+'.'+valor.substring(leng-6,leng);

                }else{

                    if(Number((valor.length)) > 9 && Number(valor.length) < 13){
                        var leng = valor.length;
                        valor = valor.substring(0,leng-9)+'.'+valor.substring(leng-9,leng-6)+'.'+ valor.substring(leng-6,leng);
                    }
                }

                return String(valor);
            }
        }
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: " Dia ("+this.param.descFilial+")",
        align: "left"
      },
      yaxis: [
        {
          show: true,
          seriesName: 'META',
          title: {
            text: 'META',
            style: {
              color: this._colors.palette1[0],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: true,
            style: {
              colors: this._colors.palette1[0],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
                var numero = val? val.toFixed(0) : '0';

                var valor = numero;
                if (String(numero).length < 4) {
                    valor = numero;
                }else{
                    if (String(numero).length < 7) {
                        valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'K';
                    } else {
                        if (String(numero).length < 11) {
                            valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'M';
                        }else{
                            if (String(numero).length < 17) {
                                valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'B';
                            }
                        }
                    }
                }

                return valor;
            }
          }
        },
        {
          show: false,
          seriesName: 'META',
          title: {
            text: 'ROL',
            style: {
              color: this._colors.palette1[1],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: '',
            }
          },
          labels: {
            show: false,
            style: {
              colors: this._colors.palette1[1],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
                var numero = val? val.toFixed(0) : '0';

                var valor = numero;
                if (String(numero).length < 4) {
                    valor = numero;
                }else{
                    if (String(numero).length < 7) {
                        valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'K';
                    } else {
                        if (String(numero).length < 11) {
                            valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'M';
                        }else{
                            if (String(numero).length < 17) {
                                valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'B';
                            }
                        }
                    }
                }

                return valor;
            }
          }
        },
        {
          show: true,
          seriesName: 'MB',
          title: {
            text: 'MB',
            style: {
              color: this._colors.palette1[2],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: true,
            style: {
              colors: this._colors.palette1[2],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
                var numero = val? val.toFixed(0) : '0';

                var valor = numero;
                if (String(numero).length < 4) {
                    valor = numero;
                }else{
                    if (String(numero).length < 7) {
                        valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'K';
                    } else {
                        if (String(numero).length < 11) {
                            valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'M';
                        }else{
                            if (String(numero).length < 17) {
                                valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'B';
                            }
                        }
                    }
                }

                return valor;
            }
          }
        }
      ],
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

  eventUpdateSomenteUmaVez = true; // Cuidado parametro Critico para loop Eterno!
  // ngOnInit(): void {
  ngAfterViewInit(): void {

    window['Apex'] = {

        chart: {
            events: {
              updated: (chartContext?: any, config? :any): void => {

                if(this.param.descFilial == 'REDE' && this.eventUpdateSomenteUmaVez){

                  chartContext.updateOptions({
                    title: {
                      text: " Dia ("+this.param.descFilial+")",
                      align: "left"
                    }
                  }) ;

                  this.eventUpdateSomenteUmaVez = false;  // Cuidado parametro Critico para loop Eterno!
                }

              },
              click: (event: any, chartContext?: any, config? :any): void => {

                switch (event.srcElement.className) {
                  case "charts-menu-item":
                    this.menuFilialChart(event);
                    chartContext.updateOptions({
                        title: {
                          text: " Dia ("+this.param.descFilial+")",
                          align: "left"
                        },
                        series: this.viewSerie}) ;
                    break;
                  case "charts-menu-item2":
                    this.menuFilialChart(event);
                    chartContext.updateOptions({
                      title: {
                        text: " Dia ( "+this.param.descFilial+" )",
                        align: "left"
                      },
                      series: this.viewSerie}) ;
                    break;
                  default:
                    break;
                }
              },
              mouseMove:(event: any, chartContext?: any, config? :any): void => {
                if(event.srcElement.className == "charts-menu-item"){
                    this.mostraMenuFilial2Chart(event);
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

    // var mes = dataPicker.value.getMonth();
    // mes = mes < 9 ? '0' + (mes+1) :  (mes+1);
    // var dataMes = '01/'+ mes + '/'+ dataPicker.value.getUTCFullYear();
    // dataPicker.targetElement.value = dataMes;

    return true;

  }

  formatDataMesAno2(dataPicker) {

    var value = dataPicker.value;

    if(value.length >= 8){
      var arrayData = value.split("/");

      if(arrayData.length ==1){
        dataPicker.value = '01/'+value.substr(2,2)+'/'+value.substr(4,4);

      }else{
        // var dia = ("00" + (arrayData[0])).slice(-2);
        var mes =  ("00" + (arrayData[1])).slice(-2);
        var ano = arrayData[2];

        dataPicker.value = '01/'+mes+'/'+ano;
      }

    }
    return true;

  }

  consultavendafilial(param ){

    this.eventUpdateSomenteUmaVez = true; // Cuidado parametro Critico para loop Eterno! Chart->Events->Update

    // var dtRef = this._elementFilter.nativeElement.lastElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.offsetParent.firstElementChild.childNodes[4].value;
    var dtRef = param;
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

    this._thishttpClient.get('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+ano+'&mes='+mes+'&dtref='+dataref)
                            .subscribe(dataresponse => {
                                      var arrayDataSource = this.formataDataSource(dataresponse.rows);
                                      this.dataSource = arrayDataSource;
                                });

    // Não foi utilizado getDataAplica devido asyncronidade na atualização do dataSource
    // var dataGet = this.vendafilialService.getDataAplica(arrayParam);
        // setTimeout(() => {
        // var lista = this.vendafilialService.data$[1];
        // var arrayDataSource =  this.formataDataSource(lista);
        // this.dataSource = arrayDataSource;
        // console.log(this.dataSource);
      // }, 600);

      this.vendafilialService.setParam(dia,mes,ano,99,'REDE');
      this.limpar(); // viewSerie, categorias, series
      this.validaParam();
      this.getCategorias();
      this.getSeries();

      // setTimeout(() => {
      //     console.log(this.chartOptions);
      // }, 10000);

  }

}
