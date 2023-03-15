/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'analiseindicadores',
        title: 'Análise de Indicadores',
        subtitle: 'Gestão de indicadores estratégicos',
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
                        title: 'Modelo Teste 1',
                        type: 'basic',
                        icon: 'heroicons_outline:clipboard-check',
                        link: '/dashboards/project',
                    },
                    {
                        id: 'dashboards.analytics',
                        title: 'Modelo Teste 2',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/dashboards/analytics',
                    },
                    {
                        id: 'dashboards.finance',
                        title: 'Modelo Teste 3',
                        type: 'basic',
                        icon: 'heroicons_outline:cash',
                        link: '/dashboards/finance',
                    },
                    {
                        id: 'dashboards.crypto',
                        title: 'Modelo Teste 4',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar',
                        link: '/dashboards/crypto',
                    },
                    {
                        id: 'dashboards.rol',
                        title: 'Rol',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar',
                        link: '/dashboards/rol',
                    },
                ],
            },
            {
                id: 'admin.ecommerce',
                title: 'Relatórios',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard',
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
    {
        id: 'user',
        title: 'Usuário',
        subtitle: 'Configurações de usuário',
        type: 'group',
        icon: 'heroicons_outline:user',
        children: [
            {
                id: 'profile',
                title: 'Perfil',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/user/profile',
            },
            {
                id: 'settings',
                title: 'Configurações',
                type: 'basic',
                icon: 'heroicons_outline:cog',
                link: '/user/settings',
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
