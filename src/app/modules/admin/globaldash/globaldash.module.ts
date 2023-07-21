import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalDashsComponent } from './globaldash.component';
import { globalDashRoutes } from './globaldash.routing';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [GlobalDashsComponent],
    imports: [
        CommonModule, 
        RouterModule.forChild(globalDashRoutes),
        MatButtonModule,
    ],
    providers: [],
})
export class GlobalDashsModule {}
