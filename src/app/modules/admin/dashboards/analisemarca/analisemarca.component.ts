import { Component, Injectable,  ViewChild} from '@angular/core';
import {ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnalisemarcaService } from './analisemarca.service';

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
  selector: 'app-analisemarca',
  templateUrl: './analisemarca.component.html',
  styleUrls: ['./analisemarca.component.scss']
})

@Injectable()
export class AnalisemarcaComponent {
  @ViewChild("chart") chart: ChartComponent;
  // @ViewChild("chart") _elChart: ElementRef;

  @ViewChild("containerFilter") _elFilter: ElementRef;
  @ViewChild("containerForm") _elForm: ElementRef;
  @ViewChild("containerDash") _elDash: ElementRef;

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

    var indexData =0;
    for (let index = 0; index < rows.length; index++) {

      if(rows[index][0] == codemp){

        var valorKey  = rows[index];

        while(valorKey[1].substr(0,2) != categorias[indexData]){

          this.viewSerie[0].data.push(0);
          this.viewSerie[1].data.push(0);
          this.viewSerie[2].data.push(0);
          indexData++;

          if(indexData > 31){ break;}
        }

        var valorMeta = !rows[index][3]?0:rows[index][3];
        var valorRol  = !rows[index][4]?0:rows[index][4];
        var valorMb   = !rows[index][10]?0:rows[index][10];

        if(valorKey[1].substr(0,2) === categorias[indexData]){
          this.viewSerie[0].data.push(valorMeta);
          this.viewSerie[1].data.push(valorRol);
          this.viewSerie[2].data.push(valorMb);
        }

        indexData++;
      }

    }

    console.log(this.viewSerie);

    this.chartOptions.title.text =  " Dia ("+descemp+")";
    this.chartOptions.series = this.viewSerie;
    this.chartOptions.xaxis.categories = categorias;

    // Ajuste realizar reflow no chart //////////////////////////////////////////
    var chart = new ApexCharts(this.chart, this.chartOptions);
    // this.showFilter('',this._elFilter.nativeElement,this._elForm.nativeElement,this._elDash.nativeElement);
    // setTimeout(() => {
    //   this.showFilter('',this._elFilter.nativeElement,this._elForm.nativeElement,this._elDash.nativeElement);
    // }, 50);
    /////////////////////////////////////////////////////////////////////////////

  }

  param = {
            mes: null,
            ano: null,
            ultDia:null,
            filial:null,
            descFilial: null
          };

  validaParam(){

    this.param.ultDia     = this.analisemarcaService.param.ultDia;
    this.param.mes        = this.analisemarcaService.param.mes;
    this.param.ano        = this.analisemarcaService.param.ano;
    this.param.filial     = this.analisemarcaService.param.filial;
    this.param.descFilial = this.analisemarcaService.param.descFilial;

    if(!this.param.ano){

      const sysDate = new Date();
      this.param.ultDia = ("00" + (sysDate.getDate()-1)).slice(-2); // dia atual -1
      this.param.mes    = ("00" + (sysDate.getMonth()+1)).slice(-2);
      this.param.ano    = sysDate.getFullYear();
      this.param.filial = 99;
      this.param.descFilial = 'REDE';

    }
  }

  categorias = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
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

    this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/429/data?ano='+ano+'&mes='+mes+'&dtref1=01'+mes+ano+'&dtref2='+dia+mes+ano)
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

  _sysdate:string;
  _elementFilter: any;
  _elementRenderer: any;
  _thishttpClient: any;
  _containerChart: any;
  _serviceChart: any;
  _chartWidth = '99%';
  _iconShowFilter: string       = 'filter_list_off';
  _tolltip_ShowFIlter: string   = 'Off filtro';
  _classChart = 'grid rounded-2xl p-0 mt-0 mr-0 mb-0 ml-0';
  _classDashInicial: string[]   = ['flex','flex-row','p-0','w-10/12','sm:w-10/12','md:w-10/12','lg:w-10/12','xl:w-10/12','2xl:w-10/12','mt-0','mr-0','mb-0','ml-0'];
  _classFilterInicial: string[] = ['flex','flex-row','p-0','w-2/12','sm:w-12/12','md:w-12/12','lg:w-2/12','xl:w-2/12','2xl:w-2/12','mt-0','mr-2','mb-0','ml-0'];
  showFilter(thisEvent,elFilter,elForm,elDash) {

    // this._chartWidth = '99%';
    this._iconShowFilter      = this._iconShowFilter== 'filter_list'? 'filter_list_off' : 'filter_list';
    this._tolltip_ShowFIlter  = this._tolltip_ShowFIlter== 'On filtro'? 'Off filtro' : 'On filtro';

    var pClassDash  = ['flex','flex-row','p-0','w-10/12','sm:w-10/12','md:w-10/12','lg:w-10/12','xl:w-10/12','2xl:w-10/12','mt-0','mr-0','mb-0','ml-0'];
    var pClassFilter= ['flex','flex-row','p-0','w-2/12','sm:w-12/12','md:w-12/12','lg:w-2/12','xl:w-2/12','2xl:w-2/12','mt-0','mr-2','mb-0','ml-0'];

    if(!elFilter.hidden){
      elFilter.hidden = true;
      elForm.hidden   = true;
      // this._chartWidth = '99%';
      pClassDash  = ['grid','h-full','w-full','p-0','w-12/12','sm:w-12/12','md:w-12/12','lg:w-12/12','xl:w-12/12','2xl:w-12/12','mt-0','mr-0','mb-0','ml-0'];
      pClassFilter= ['flex','flex-col','p-0','w-0'   ,'sm:h-0'   ,'md:h-0'   ,'lg:w-0'   ,'xl:w-0'   ,'2xl:w-0','mt-0','mr-0','mb-0','ml-0'];

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

  public menuFilialChart(el): void {

    this.analisemarcaService.param.filial = el.srcElement.attributes[1].value ;

    this.param.filial     = el.srcElement.attributes[1].value ;
    this.param.descFilial = el.srcElement.innerText ;

    this.analisemarcaService.setParam(this.param.ultDia,this.param.mes, this.param.ano, this.param.filial, this.param.descFilial );

    this.viewSerie = [
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
  constructor(private analisemarcaService: AnalisemarcaService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient){

    this._elementFilter     = _element;
    this._elementRenderer   = _renderer;
    this._thishttpClient    = _httpClient;

    const sysDate = new Date();
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;
    this._sysdate  = '('+mes+'/'+sysDate.getFullYear() +')';

    this.validaParam();
    // this.getCategorias();
    this.getSeries();

    analisemarcaService.getXaxis();
    this.categorias = analisemarcaService.xAxis;

    console.log(this.categorias);

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
                      <div class="charts-menu-item" value="99"> Indicadores </div>
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
      stroke: {
        curve: "straight"
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
              var valor = val? val.toFixed(0) : '';
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
              var valor = val? val.toFixed(0) : '';
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
              var valor = val? val.toFixed(2) : '';
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
  ngAfterViewInit(): void {

    window['Apex'] = {

        chart: {
            events: {
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

  consultavendafilial(param ){

    this.eventUpdateSomenteUmaVez = true; // Cuidado parametro Critico para loop Eterno! Chart->Events->Update

    // console.log(param);
    this._chartWidth = '83%';
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

    this.analisemarcaService.setParam(dia,mes,ano,99,'REDE');
    this.limpar(); // viewSerie, categorias, series
    this.validaParam();
    this.getCategorias();
    this.getSeries();

  }

}
