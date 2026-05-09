import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../directives/reveal-on-scroll';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RevealOnScrollDirective,RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {

}
