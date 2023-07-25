import { Route } from '@angular/router';
import { tipovendaComponent } from './tipovenda.component';
import { tipovendaResolver } from './tipovenda.resolver';

export const tipovendaRoutes: Route[] = [
    {
        path: '',
        component: tipovendaComponent,
        resolve: {
            data: tipovendaResolver,
        },
    },
];
