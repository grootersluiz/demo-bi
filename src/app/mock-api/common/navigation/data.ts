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
                    // {
                    //     id: 'dashboards.project',
                    //     title: 'Modelo Teste 1',
                    //     type: 'basic',
                    //     icon: 'heroicons_outline:clipboard-check',
                    //     link: '/dashboards/project',
                    // },
                    // {
                    //     id: 'dashboards.analytics',
                    //     title: 'Modelo Teste 2',
                    //     type: 'basic',
                    //     icon: 'heroicons_outline:chart-pie',
                    //     link: '/dashboards/analytics',
                    // },
                    // {
                    //     id: 'dashboards.finance',
                    //     title: 'Modelo Teste 3',
                    //     type: 'basic',
                    //     icon: 'heroicons_outline:cash',
                    //     link: '/dashboards/finance',
                    // },
                    // {
                    //     id: 'dashboards.crypto',
                    //     title: 'Modelo Teste 4',
                    //     type: 'basic',
                    //     icon: 'heroicons_outline:currency-dollar',
                    //     link: '/dashboards/crypto',
                    // },
                    {
                        id: 'dashboards.rol',
                        title: 'ROL',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-bar',
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
                        title: 'Produtos',
                        type: 'basic',
                        link: '/apps/ecommerce/inventory',
                    },
                ],
            },
        ],
    },

    {
        id: 'records',
        title: 'Cadastros',
        subtitle: 'Usuários, Dashboards, Relatórios',
        type: 'group',
        // icon: 'heroicons_outline:user',
        children: [
            {
                id: 'regusers',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/records/regusers',
            },
            {
                id: 'regdashsreports',
                title: 'Dashboards/Relatórios',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/records/regdashsreports',
            },
            {
                id: 'regviews',
                title: 'Views',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/records/regviews',
            },
        ],
    },
    // {
    //     id: 'user',
    //     title: 'Usuário',
    //     subtitle: 'Configurações de usuário',
    //     type: 'group',
    //     icon: 'heroicons_outline:user',
    //     children: [
    //         {
    //             id: 'profile',
    //             title: 'Perfil',
    //             type: 'basic',
    //             icon: 'heroicons_outline:user-circle',
    //             link: '/user/profile',
    //         },
    //         {
    //             id: 'settings',
    //             title: 'Configurações',
    //             type: 'basic',
    //             icon: 'heroicons_outline:cog',
    //             link: '/user/settings',
    //         },
    //     ],
    // },
    {
        id: 'exemploscomponentes',
        title: 'Exemplos de componentes',
        subtitle: 'Base de componentes para desenvolvimento',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboardstest',
                title: ' Modelos de Dashboards',
                type: 'collapsable',
                icon: 'heroicons_outline:home',
                link: '/analiseindicadores/dashboardstest',
                children: [
                    {
                        id: 'project',
                        title: 'Modelo Teste 1',
                        type: 'basic',
                        icon: 'heroicons_outline:clipboard-check',
                        link: '/dashboardstest/project',
                    },
                    {
                        id: 'analytics',
                        title: 'Modelo Teste 2',
                        type: 'basic',
                        icon: 'heroicons_outline:chart-pie',
                        link: '/dashboardstest/analytics',
                    },
                    {
                        id: 'finance',
                        title: 'Modelo Teste 3',
                        type: 'basic',
                        icon: 'heroicons_outline:cash',
                        link: '/dashboardstest/finance',
                    },
                    {
                        id: 'crypto',
                        title: 'Modelo Teste 4',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar',
                        link: '/dashboardstest/crypto',
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
