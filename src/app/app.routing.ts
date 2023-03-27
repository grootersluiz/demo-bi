import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthRedirectGuard } from 'app/core/auth/guards/auth.redirect.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

    {
        path: 'sign-in',
        canActivate: [AuthRedirectGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        loadChildren: () =>
            import('app/modules/auth/sign-in/sign-in.module').then(
                (m) => m.AuthSignInModule
            ),
    },
    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards/project',
    },

    // Auth routes for guests
    {
        path: '',
        canMatch: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canMatch: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'apps/ecommerce',
            },

            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.module').then(
                        (m) => m.LandingHomeModule
                    ),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canMatch: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'apps',
                children: [
                    {
                        path: 'ecommerce',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/ecommerce/ecommerce.module'
                            ).then((m) => m.ECommerceModule),
                    },
                ],
            },
            {
                path: 'dashboards',
                children: [
                    {
                        path: 'project',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/project/project.module'
                            ).then((m) => m.ProjectModule),
                    },
                    {
                        path: 'analytics',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.module'
                            ).then((m) => m.AnalyticsModule),
                    },
                    {
                        path: 'finance',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/finance/finance.module'
                            ).then((m) => m.FinanceModule),
                    },
                    {
                        path: 'crypto',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/crypto/crypto.module'
                            ).then((m) => m.CryptoModule),
                    },
                    {
                        path: 'rol',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/rol/rol.module'
                            ).then((m) => m.RolModule),
                    },
                ],
            },
            {
                path: 'user',
                children: [
                    {
                        path: 'profile',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/maintenance/maintenance.module'
                            ).then((m) => m.MaintenanceModule),
                    },
                    {
                        path: 'settings',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/maintenance/maintenance.module'
                            ).then((m) => m.MaintenanceModule),
                    },
                ],
            },
            {
                path: 'records',
                children: [
                    {
                        path: 'regusers',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/settings/settings.module'
                            ).then((m) => m.SettingsModule),
                    },
                    {
                        path: 'regdashsreports',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/layouts/layouts.module'
                            ).then((m) => m.FormsLayoutsModule),
                    },
                    {
                        path: 'regviews',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/maintenance/maintenance.module'
                            ).then((m) => m.MaintenanceModule),
                    },
                ],
            },
        ],
    },
];
