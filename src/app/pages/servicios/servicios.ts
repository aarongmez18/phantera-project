import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';

@Component({
  selector: 'app-servicios',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class Servicios {

}
