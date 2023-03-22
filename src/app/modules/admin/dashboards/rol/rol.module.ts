import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { RolComponent } from 'app/modules/admin/dashboards/rol/rol.component';
import { rolRoutes } from 'app/modules/admin/dashboards/rol/rol.routing';
import {
    MatFormFieldModule,
    MatLabel,
    MatFormFieldControl,
} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
    MatMomentDateModule,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@NgModule({
    declarations: [RolComponent],
    imports: [
        RouterModule.forChild(rolRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        NgApexchartsModule,
        SharedModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatSelectModule,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class RolModule {}
