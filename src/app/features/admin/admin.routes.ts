import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from '../../core/auth/auth.guard';
import { provideAdminBackend } from '../../core/backend/provide-admin-backend';
import { AdminDraftService } from './admin-draft.service';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    providers: [...provideAdminBackend(), AdminDraftService],
    children: [
      {
        path: 'entrar',
        canActivate: [guestGuard],
        title: 'Entrar · Painel',
        loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: '',
        canActivate: [adminGuard],
        loadComponent: () => import('./shell/admin-shell.component').then((m) => m.AdminShellComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'geral' },
          {
            path: ':slug',
            title: 'Painel do site',
            loadComponent: () => import('./section-page/section.page').then((m) => m.SectionPage),
          },
        ],
      },
    ],
  },
];
