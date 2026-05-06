import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';

@Component({
  selector: 'app-panthera',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './panthera.html',
  styleUrl: './panthera.scss',
})
export class Panthera {}