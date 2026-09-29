import { Routes } from '@angular/router';
import { HomePage } from './features/public/home/home.page';

export const routes: Routes = [
  { path: '', component: HomePage, title: "Grupo Mania D'Água · Gás e água mineral em Estância Velha e Novo Hamburgo" },
  // Hidden admin: not linked anywhere on the public site.
  { path: 'painel', loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES) },
  { path: '**', redirectTo: '' },
];
