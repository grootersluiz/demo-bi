import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalDashsComponent } from './globaldash.component';
import { globalDashRoutes } from './globaldash.routing';
import { MatButtonModule } from '@angular/material/button';
import { SharedDataService } from '../dashboards/shareddata.service';

@NgModule({
    declarations: [GlobalDashsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(globalDashRoutes),
        MatButtonModule,
    ],
    providers: [SharedDataService],
})
export class GlobalDashsModule {}
