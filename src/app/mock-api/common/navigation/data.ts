/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'analiseindicadores',
        title: 'Análise de Indicadores',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards',
                title: 'Dashboards',
                type: 'collapsable',
                icon: 'heroicons_outline:home',
                link: '/analiseindicadores/dashboards',
                children: [
                    {
                        id: 'dashboards.project',
                        title: 'Project',
                        type: 'basic',
                        icon: 'heroicons_outline:clipboard-check',
                        link: '/dashboards/project',
                    },
                    {
                        id: 'dashboards.analytics',
                        title: 'Analytics',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/dashboards/analytics',
                    },
                    {
                        id: 'dashboards.finance',
                        title: 'Finance',
                        type: 'basic',
                        icon: 'heroicons_outline:cash',
                        link: '/dashboards/finance',
                    },
                    {
                        id: 'dashboards.crypto',
                        title: 'Crypto',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar',
                        link: '/dashboards/crypto',
                    },
                ],
            },
            {
                id: 'admin.ecommerce',
                title: 'Relatórios',
                type: 'collapsable',
                icon: 'heroicons_outline:home',
                link: '/analiseindicadores/admin.ecommerce',
                children: [
                    {
                        id: 'admin.ecommerce.inventory',
                        title: 'Inventário',
                        type: 'basic',
                        link: '/apps/ecommerce/inventory',
                    },
                ],
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'admin.ecommerce',
        title: 'Relatórios',
        type: 'collapsable',
        // icon: 'heroicons_outline:shopping-cart',
        children: [
            {
                id: 'admin.ecommerce.inventory',
                title: 'Inventário',
                type: 'basic',
                link: '/apps/ecommerce/inventory',
            },
        ],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'admin.ecommerce',
        title: 'Relatórios',
        type: 'collapsable',
        // icon: 'heroicons_outline:shopping-cart',
        children: [
            {
                id: 'admin.ecommerce.inventory',
                title: 'Inventário',
                type: 'basic',
                link: '/apps/ecommerce/inventory',
            },
        ],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'admin.ecommerce',
        title: 'Relatórios',
        type: 'collapsable',
        // icon: 'heroicons_outline:shopping-cart',
        children: [
            {
                id: 'admin.ecommerce.inventory',
                title: 'Inventário',
                type: 'basic',
                link: '/apps/ecommerce/inventory',
            },
        ],
    },
];
