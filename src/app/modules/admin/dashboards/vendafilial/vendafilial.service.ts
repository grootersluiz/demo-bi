import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VendafilialService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.value;
    }

    getData(): Observable<{data:String[];}> {
        return this._httpClient.get<{data:String[];}>('http://api.portal.jspecas.com.br/v1/views/163/data?ano=2023&mes=03&dtref=31032023').pipe(
            tap((response: any) => {
                this._data.next([response.columns,response.rows]);
            })
        );
    }

    getDataAplica(param) {

        this._data.next(param);

        // return this.getData(this.data$.value);
    }
}
