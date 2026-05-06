import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}