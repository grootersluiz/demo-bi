import { Component, OnInit} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectfilialService } from './selectfilial.service';
import { Subject, takeUntil } from 'rxjs';
import { SelectfilialModule } from './selectfilial.module';

import { Injectable } from '@angular/core';

@Component({
  selector: 'app-selectfilial',
  templateUrl: './selectfilial.component.html',
  styleUrls: ['./selectfilial.component.scss','../css/css.component.scss']
})

@Injectable()
export class SelectfilialComponent {

    constructor(
        private _selectfilialService: SelectfilialService,
        private _cdr: ChangeDetectorRef,
    ) {

    }

    data: any;
    filiais = new FormControl(this._selectfilialService.INITIAL_COMPANIES_IDS);
    filiaisObjects: { id: number; string: string }[];
    filiaisStringList: string[];
    allCompaniesSelected: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    selectAllCompanies() {
        if (!this.allCompaniesSelected) {
            let newFiliais = this.filiaisObjects.map((item) =>
                item.id.toString()
            );
            this.filiais.setValue(newFiliais);
            this.allCompaniesSelected = true;
        } else {
            this.filiais.setValue(this._selectfilialService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    handleCompanyFilterSelect(filialId: number) {
        //this.vendedoresStringList = ['Carregando...'];
        if (this.filiais.value.length > 0) {
            this.allCompaniesSelected = true;
        }
        if (this.filiais.value.length == 0) {
            this.filiais.setValue(this._selectfilialService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    ngOnInit(): void {
    // ngAfterViewInit(): void {
        this._selectfilialService.getData();

        // this.data = this._selectfilialService.data$.source.v;

        // console.log(this.data);

        // this.filiaisObjects = this.data.filiaisLista;
        // this.filiaisStringList = this.filiaisObjects.map(
        //     (item) => item.string
        // );

        // // Trigger the change detection mechanism so that it updates the chart when filtering
        // this._cdr.markForCheck();

        // Get the data
        this._selectfilialService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                if(this.data){

                    this.filiaisObjects = this.data.filiaisLista;
                    this.filiaisStringList = this.filiaisObjects.map(
                        (item) => item.string
                    );

                    // Trigger the change detection mechanism so that it updates the chart when filtering
                    this._cdr.markForCheck();

                }

            });

        }

}
