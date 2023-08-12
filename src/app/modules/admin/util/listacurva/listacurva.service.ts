import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap , map, pipe} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListacurvaService {

 private _data: BehaviorSubject<any> = new BehaviorSubject(null);

 readonly REPORT_FILTRO_FILIAIS = '101';
 readonly INITIAL_COMPANIES_IDS = ['null'];

  constructor(private _httpClient : HttpClient) { }

  get data$(): Observable<any> {
    return this._data.asObservable();
  }

  getData(): Observable<any> {
    // let url = `http://10.2.1.108/v1/dashboards/data?reportId=${this.REPORT_FILTRO_FILIAIS}`;
    let url = `http://10.2.1.108/v1/views/570/data?`;

     this._httpClient.get<Observable<any>>(url)
                                .subscribe((dataresponse: any) => {

                                    const COD_CURVA = 0;
                                    const DESCRICAO = 1;
                                    const companyFilter = dataresponse.rows.map((item) => {
                                        return {
                                            id: item[COD_CURVA],
                                            string: item[DESCRICAO]
                                        };
                                    });
                                    const dashData = {
                                        curvasLista: companyFilter
                                    };

                                    this._data.next(dashData);
                                    // this._data.next(null);
                                });

                                return;

    }
}

