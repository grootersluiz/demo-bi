import { Route } from '@angular/router';
import { DashestoqueComponent } from './dashestoque.component';
import { DashEstoqueResolver } from './dashestoque.resolver';


export const dashEstoqueRoutes: Route[] = [
    {
        path: '',
        component: DashestoqueComponent,
        resolve: {
            data: DashEstoqueResolver,
        },
    },
];
