import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { LinksComponent } from './links.component';
import { RouterModule } from '@angular/router';
import { linksRoutes } from './links.routing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [LinksComponent],
    imports: [
        MatChipsModule,
        MatGridListModule,
        MatCardModule,
        CommonModule,
        RouterModule.forChild(linksRoutes),
    ],
})
export class LinksModule {}
