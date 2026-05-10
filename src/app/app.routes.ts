import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { AvisoLegal } from './pages/aviso-legal/aviso-legal';
import { Privacidad } from './pages/privacidad/privacidad';
import { Cookies } from './pages/cookies/cookies';
import { Panthera } from './pages/panthera/panthera';
import { NotFound } from './shared/not-found/not-found';
import { SobreJulia } from './pages/sobre-julia/sobre-julia';
import { Servicios } from './pages/servicios/servicios';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Panthera Project',
  },
  {
    path: 'aviso-legal',
    component: AvisoLegal,
    title: 'Aviso legal | Panthera Project',
  },
  {
    path: 'privacidad',
    component: Privacidad,
    title: 'Política de privacidad | Panthera Project',
  },
  {
    path: 'cookies',
    component: Cookies,
    title: 'Política de cookies | Panthera Project',
  },
  {
    path: 'panthera',
    component: Panthera,
    title: 'Panthera Project | Panthera Project',
  },
  {
    path: 'sobre-julia',
    component: SobreJulia,
    title: 'Sobre Julia | Panthera Project',
  },
  {
    path: 'servicios',
    component: Servicios,
    title: 'Servicios | Panthera Project',
  },
  {
    path: '**',
    component: NotFound,
  },
];