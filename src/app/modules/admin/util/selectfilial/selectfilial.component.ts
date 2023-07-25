import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectfilialService } from './selectfilial.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-selectfilial',
  templateUrl: './selectfilial.component.html',
  styleUrls: ['./selectfilial.component.scss']
})
export class SelectfilialComponent {

    constructor(
        private _selectfilialService: SelectfilialService,
        private _cdr: ChangeDetectorRef,
    ) {}

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

    ngOnInit(): void {
        // Get the data
        this._selectfilialService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                this.filiaisObjects = this.data.filiaisLista;
                this.filiaisStringList = this.filiaisObjects.map(
                    (item) => item.string
                );

                // Trigger the change detection mechanism so that it updates the chart when filtering
                this._cdr.markForCheck();
            });
        }

}
