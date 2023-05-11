import { Component, Injectable, TemplateRef, ViewChild} from '@angular/core';
import { VendafilialService } from './vendafilial.service';
import { Observable, async } from 'rxjs';

import { Subject, takeUntil } from 'rxjs';

import { formatNumber } from '@angular/common';
import { LocalizedString, parseTemplate } from '@angular/compiler';

import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { template, toPlainObject } from 'lodash';
// import { VendafilialchartComponent } from './vendafilialchart/vendafilialchart.component';
// import { VendafilialchartService } from './vendafilialchart/vendafilialchart.service';

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
      data: []
    },
    {
      name: "ROL",
      data: []
    }
  ];
  posicionaValorXinCategoria(categorias,rows){

    var keyX = 2;
    var codemp = this.param.filial;

    var indexData =0;
    // console.log('valorKey');
    for (let index = 0; index < categorias.length; index++) {
      // const element = categorias[index];
      
      var valorKey  = rows[indexData];

      if(rows[indexData][0] == codemp){

        // console.log(valorKey);
        
        while(valorKey[1].substr(0,2) != categorias[indexData]){
          // console.log(valorKey[1].substr(0,2) + ' != '+categorias[indexData]);
          this.viewSerie[0].data.push(0);
          this.viewSerie[1].data.push(0);
          indexData++;

          if(indexData > 31){ break;}
        }
  
        var valorMeta = !rows[indexData][3]?0:rows[indexData][3];
        var valorRol  = !rows[indexData][4]?0:rows[indexData][4];
        
        if(valorKey[1].substr(0,2) === categorias[indexData]){
          this.viewSerie[0].data.push(valorMeta);
          this.viewSerie[1].data.push(valorRol);
        }
      }

      indexData++;
      
    }

    this.chartOptions.series = this.viewSerie;
    this.chartOptions.xaxis.categories = categorias;

  }

  param = {
            mes: null,
            ano: null,
            ultDia:null,
            filial:null
          };

  validaParam(){

    // var chartService = new VendafilialchartService() ;
    // this.param = chartService.param;
    this.param.ultDia = this.vendafilialService.param.ultDia;
    this.param.mes    = this.vendafilialService.param.mes;
    this.param.ano    = this.vendafilialService.param.ano;
    this.param.filial = this.vendafilialService.param.filial;

    if(!this.param.ano){

      const sysDate = new Date();
      this.param.ultDia = ("00" + (sysDate.getDate()-1)).slice(-2); // dia atual -1
      this.param.mes    = ("00" + (sysDate.getMonth()+1)).slice(-2);
      this.param.ano    = sysDate.getFullYear();
      this.param.filial = 99;

    }
  }

  setParam(ultDia,mes, ano, filial){

    this.param.ultDia = ultDia;
    this.param.mes    = mes;
    this.param.ano    = ano;
    this.param.filial = filial;
  }

  categorias = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30','31'];
  getCategorias(){

    var dia = parseInt(this.param.ultDia);

    var contDia: string;
    for (let index = 1 ; index <= dia; index++) {
      
      contDia = ("00" + index).slice(-2) ;
      this.categorias.push(contDia);
      
    }

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
                                 this.posicionaValorXinCategoria(this.categorias,this.series.rows);

                            });

  }

  limpar(){
    this.series = {columns: [], rows: []};
    this.categorias = new Array();
    this.viewSerie = [
      {
        name: "META",
        data: []
      },
      {
        name: "ROL",
        data: []
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

  
  _iconShowFilter: string       = 'filter_list';
  _tolltip_ShowFIlter: string   = 'On filtro';
  _classDashInicial: string[]   = ['flex','flex-col','p-0','w-4/5','sm:w-full','md:w-full','lg:w-4/5','xl:w-4/5','2xl:w-4/5'];
  _classFilterInicial: string[] = ['flex','flex-col','p-0','w-1/5','sm:w-full','md:w-full','lg:w-1/5','xl:w-1/5','2xl:w-1/5'];
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

    


  /////////////////////////////////////// Construtor  ///////////////////////////////////////////////
  constructor(private vendafilialService: VendafilialService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient){

    this._elementFilter     = _element;
    this._elementRenderer   = _renderer;
    this._thishttpClient    = _httpClient;

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
    this.getCategorias();
    this.getSeries();

    // setTimeout(() => { }, 1000);

    this.chartOptions = {
      series: this.viewSerie,
      chart: {
        width: "100%",
        height: '100%',
        type: "area",
        stacked: false,
        zoom: {
          enabled: true,
          type: 'xy', 
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: " Dia (Rede JS)",
        align: "left"
      },
      yaxis: [
        {
          show: true,
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
              return val.toFixed(0);
            }
          }
        },
        // {
        //   show: true,
        //   title: {
        //     text: 'ROL',
        //     style: {
        //       color: this._colors.palette1[1],
        //       fontSize: '12px',
        //       fontFamily: 'Helvetica, Arial, sans-serif',
        //       fontWeight: 600,
        //       cssClass: '',
        //     }
        //   },
        //   labels: {
        //     show: false,
        //     style: {
        //       colors: this._colors.palette1[1],
        //       cssClass: 'apexcharts-yaxis-label'
        //     },
        //     formatter: function(val, index) {
        //       return val.toFixed(0);
        //     }
        //   }
        // }
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

  formatDataMesAno(dataPicker) {

    var mes = dataPicker.value.getMonth();

    mes = mes < 9 ? '0' + (mes+1) :  (mes+1);

    var dataMes = '01/'+ mes + '/'+ dataPicker.value.getUTCFullYear();

    dataPicker.targetElement.value = dataMes;
    return true;

  }

  consulatvendafilial(param ){

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

      this.vendafilialService.setParam(dia,mes,ano,99);
      this.limpar(); // viewSerie, categorias, series
      this.validaParam();
      this.getCategorias();
      this.getSeries();

      // setTimeout(() => {
      //     console.log(this.chartOptions);
      // }, 10000);

  }

}
