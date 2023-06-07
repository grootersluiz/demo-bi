import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ChartData {
    sellerData: any[];
    monthsDiff: number;
    percentGoals: number;
}

@Component({
    selector: 'goals-dialog',
    templateUrl: 'goalsdialog.component.html',
})
export class GoalsDialogComponent {
    selectedItems: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<GoalsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ChartData
    ) {}
}
