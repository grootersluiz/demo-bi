import { Injectable } from '@angular/core';
import { tipovendaComponent} from './tipovenda.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class tipovendaService {
    series = {columns: [], rows: []};

    seriesPie = [];
     ELEMENT_DATA= [
        {qtde: '1x',  mai: 15760099 , jun: 15167076 , jul: 11705482 ,totalGeral: 42632657   },
        {qtde: '2x',  mai: 88636    , jun: 55806    , jul: 67387    ,totalGeral: 211829     },
        {qtde: '3x',  mai: 25065    , jun: null     , jul: null     ,totalGeral: 25064      },
        {qtde: '4x',  mai: 3719181  , jun: 3472790  , jul: 2768158  ,totalGeral: 9960129    },
        {qtde: '5x',  mai: 8458913  , jun: 7762150  , jul: 6038640  ,totalGeral: 22259703   },
        {qtde: '6x',  mai: 5098005  , jun: 4458251  , jul: 3453893  ,totalGeral: 13010149   },
        {qtde: '7x',  mai: 1900901  , jun: 1972148  , jul: 1537048  ,totalGeral: 5410097    },
        {qtde: '8x',  mai: 2509259  , jun: 1775790  , jul: 1533185  ,totalGeral: 5818233    },
        {qtde: '10x', mai: 40919    , jun: 81632    , jul: 25034    ,totalGeral: 147585     },
        {qtde: '12x', mai: 241121   , jun: 126898   , jul: 59042    ,totalGeral: 427060     },

      ];


      getSeriesPie(): Observable<any>{

        return this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/514/data?');
      }
      getSeriesM1(): Observable<any>{

        return this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/515/data?');
      }
      getSeriesPie2(): Observable<any>{

        return this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/517/data?');
      }
      getSeriesM2(): Observable<any>{

        return this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/518/data?');
      }
  constructor(private _httpClient: HttpClient) { }

}
