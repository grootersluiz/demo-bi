import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VendasDashComponent } from './vendas.component';
import { vendasDashRoutes } from './vendas.routing';

@NgModule({
    declarations: [VendasDashComponent],
    imports: [CommonModule, RouterModule.forChild(vendasDashRoutes)],
})
export class VendasDashModule {}
