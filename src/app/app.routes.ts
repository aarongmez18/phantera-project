import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Sponsors } from './sections/sponsors/sponsors';


export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Phantera Project',
  },
  {
    path: 'sponsors',
    component: Sponsors,
    title: 'Sponsors | Phantera Project',
  },
  {
    path: '**',
    redirectTo: '',
  },
];