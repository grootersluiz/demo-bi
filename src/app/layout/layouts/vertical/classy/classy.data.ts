import { Navigation } from 'app/core/navigation/navigation.types';

export const navigationData: Navigation = {
    compact: [{}],
    default: [
        // {
        //     id: 'links',
        //     title: 'Links',
        //     type: 'collapsable',
        //     icon: 'material_outline:menu_open',
        //     link: '/links',
        //     children: [
        //         {
        //             id: '43',
        //             title: 'Links - Geral',
        //             type: 'basic',
        //             icon: 'material_outline:double_arrow',
        //             link: '/links/linksGeral',
        //         },
        //         {
        //             id: '44',
        //             title: 'Links - T.I',
        //             type: 'basic',
        //             icon: 'material_outline:double_arrow',
        //             link: '/links/linksTI',
        //         },
        //     ],
        // },
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
                            id: '41',
                            title: 'ROL',
                            type: 'basic',
                            icon: 'heroicons_outline:chart-bar',
                            link: '/dashboards/41',
                        },
                        {
                            id: '42',
                            title: 'Venda Filial Mês',
                            type: 'basic',
                            icon: 'heroicons_outline:chart-bar',
                            link: '/dashboards/42',
                        },
                        {
                            id: '181',
                            title: 'Análise Marca',
                            type: 'basic',
                            icon: 'heroicons_outline:chart-bar',
                            link: '/dashboards/181',
                        },
                        {
                            id: '241',
                            title: 'Links',
                            type: 'basic',
                            icon: 'material_outline:double_arrow',
                            link: '/dashboards/241',
                        },
                    ],
                },
            ],
        },

        {
            id: 'cadastros',
            title: 'Cadastros',
            subtitle: 'Usuários, Dashboards, Relatórios',
            type: 'group',
            // icon: 'heroicons_outline:user',
            children: [
                {
                    id: 'usuarios',
                    title: 'Usuários',
                    type: 'basic',
                    icon: 'heroicons_outline:user',
                    link: '/cadastros/usuarios',
                },
                {
                    id: 'grupos',
                    title: 'Grupos de Usuários',
                    type: 'basic',
                    icon: 'heroicons_outline:user-group',
                    link: '/cadastros/grupos',
                },
                {
                    id: 'dashboards',
                    title: 'Dashboards',
                    type: 'basic',
                    icon: 'heroicons_outline:chart-pie',
                    link: '/cadastros/dashboards',
                },
                {
                    id: 'relatorios',
                    title: 'Relatórios',
                    type: 'basic',
                    icon: 'heroicons_outline:clipboard-check',
                    link: '/cadastros/relatorios',
                },
                {
                    id: 'views',
                    title: 'Views',
                    type: 'basic',
                    icon: 'heroicons_outline:clipboard-check',
                    link: '/cadastros/views',
                },
            ],
        },

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
    ],
    futuristic: [{}],
    horizontal: [{}],
} as Navigation;
