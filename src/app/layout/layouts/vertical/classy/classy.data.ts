import { Navigation } from 'app/core/navigation/navigation.types';

export const navigationData: Navigation = {
    compact: [{}],
    default: [
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
                            id: 'dashboards.rol',
                            title: 'ROL',
                            type: 'basic',
                            icon: 'heroicons_outline:chart-bar',
                            link: '/dashboards/rol',
                        },
                        {
                            id: 'dashboards.vendafilial',
                            title: 'Venda Filial Mês',
                            type: 'basic',
                            icon: 'heroicons_outline:chart-bar',
                            link: '/dashboards/vendafilial',
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
                    id: 'reggroups',
                    title: 'Grupos de Usuários',
                    type: 'basic',
                    icon: 'heroicons_outline:user-group',
                    link: '/records/reggroups',
                },
                {
                    id: 'regdashsreports',
                    title: 'Dashboards',
                    type: 'basic',
                    icon: 'heroicons_outline:chart-pie',
                    link: '/records/regdashsreports',
                },
                {
                    id: 'regreports',
                    title: 'Relatórios',
                    type: 'basic',
                    icon: 'heroicons_outline:clipboard-check',
                    link: '/records/regreports',
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
