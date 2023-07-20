import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalDashsComponent } from './globaldash.component';
import { globalDashRoutes } from './globaldash.routing';

@NgModule({
    declarations: [GlobalDashsComponent],
    imports: [CommonModule, RouterModule.forChild(globalDashRoutes)],
    providers: [],
})
export class GlobalDashsModule {}
