import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    columnName: string;
    columnData: string[];
}

@Component({
    selector: 'filter-dialog',
    templateUrl: 'filterdialog.component.html',
})
export class FilterDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<FilterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    testTest(): void {
        console.log(this.data);
    }
}
