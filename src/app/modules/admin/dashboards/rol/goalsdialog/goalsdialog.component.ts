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
            colors: ['#94A3B8'],
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#333',
                        startAngle: -90,
                        endAngle: 90,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontSize: '30px',
                            show: true,
                        },
                    },
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    gradientToColors: ['#FF8C00'],
                    stops: [0, 100],
                },
            },
            stroke: {
                lineCap: 'butt',
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
