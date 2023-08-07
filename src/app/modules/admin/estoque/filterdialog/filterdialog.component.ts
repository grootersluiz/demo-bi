import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    columnName: string;
    headerLabel: string;
    columnData: string[];
}

@Component({
    selector: 'filter-dialog',
    templateUrl: 'filterdialog.component.html',
})
export class FilterDialogComponent {
    selectedItems: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<FilterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    onCheckboxChange(checked: boolean, row: string): void {
        if (checked) {
            this.selectedItems.push(row);
        } else {
            const index = this.selectedItems.indexOf(row);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            }
        }
    }
}
