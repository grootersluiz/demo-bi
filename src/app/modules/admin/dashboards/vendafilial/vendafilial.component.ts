import { Component} from '@angular/core';
import { VendafilialService } from './vendafilial.service';
import { Observable, async } from 'rxjs';

import { formatNumber } from '@angular/common';
import { LocalizedString } from '@angular/compiler';

import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { toPlainObject } from 'lodash';

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

@Component({
  selector: 'app-vendafilial',
  templateUrl: './vendafilial.component.html',
  styleUrls: ['./vendafilial.component.scss']
})

export class VendafilialComponent {

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

  /////////////////////////////////////// Construtor  ///////////////////////////////////////////////
  constructor(private vendafilialService: VendafilialService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient){

    this._elementFilter   = _element;
    this._elementRenderer = _renderer;
    this._thishttpClient = _httpClient;

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
    console.log(sysDate.getFullYear());
    console.log(dataSplit[2])
    console.log(mes);
    console.log(dataSplit[1]);
    if(sysDate.getFullYear() == dataSplit[2] && mes == dataSplit[1]){
      dataref = dia + mes + sysDate.getFullYear();
    }

    this._thishttpClient.get('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+dataSplit[2]+'&mes='+dataSplit[1]+'&dtref='+dataref)
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

  }

}
