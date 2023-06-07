import {
    Component,
    Inject,
    AfterViewInit,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApexOptions } from 'ng-apexcharts';

export interface ChartData {
    sellerData: any[];
    monthsDiff: number;
    percentGoals: number;
}

@Component({
    selector: 'goals-dialog',
    templateUrl: 'goalsdialog.component.html',
})
export class GoalsDialogComponent implements AfterViewInit {
    @ViewChild('chartContainer') chartContainer!: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<GoalsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ChartData
    ) {}

    ngAfterViewInit() {
        const goalsChart: ApexOptions = {
            chart: {
                height: 200,
                type: 'radialBar',
            },

            series: [this.data.percentGoals],
            colors: ['#FF8C00'],

            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 15,
                        size: '70%',
                    },

                    dataLabels: {
                        name: {
                            offsetY: -10,
                            show: true,
                            color: '#888',
                            fontSize: '10px',
                        },
                        value: {
                            color: '#111',
                            fontSize: '25px',
                            show: true,
                        },
                    },
                },
            },

            stroke: {
                lineCap: 'round',
            },
            labels: ['Aproveitamento'],
        };

        const chart = new ApexCharts(
            this.chartContainer.nativeElement,
            goalsChart
        );
        chart.render();
    }
}
