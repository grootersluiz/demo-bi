import { Component, OnInit} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListacurvaService } from './listacurva.service';
import { Subject, takeUntil } from 'rxjs';
import { ListacurvaModule } from './listacurva.module';
import { Injectable } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-listacurva',
  templateUrl: './listacurva.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./listacurva.component.scss','../css/css.component.scss']
})

@Injectable()
export class ListacurvaComponent {

    constructor(
        private _listacurvaService: ListacurvaService,
        private _cdr: ChangeDetectorRef,
    ) {

    }

    data: any;
    curvas = new FormControl(this._listacurvaService.INITIAL_COMPANIES_IDS);
    curvasObjects: { id: number; string: string }[];
    curvasStringList: string[];
    allCompaniesSelected: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    selectAllCompanies() {
        if (!this.allCompaniesSelected) {
            let newCurvas = this.curvasObjects.map((item) =>
                item.id.toString()
            );
            this.curvas.setValue(newCurvas);
            this.allCompaniesSelected = true;
        } else {
            this.curvas.setValue(this._listacurvaService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    handleCompanyFilterSelect(curvaId: number) {
        //this.vendedoresStringList = ['Carregando...'];
        if (this.curvas.value.length > 0) {
            this.allCompaniesSelected = true;
        }
        if (this.curvas.value.length == 0) {
            this.curvas.setValue(this._listacurvaService.INITIAL_COMPANIES_IDS);
            this.allCompaniesSelected = false;
        }
    }

    ngOnInit(): void {
    // ngAfterViewInit(): void {
        this._listacurvaService.getData();

        // Get the data
        this._listacurvaService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                if(this.data){

                    this.curvasObjects = this.data.curvasLista;
                    this.curvasStringList = this.curvasObjects.map(
                        (item) => item.string
                    );

                    // Trigger the change detection mechanism so that it updates the chart when filtering
                    this._cdr.markForCheck();

                }

            });

    }

}
