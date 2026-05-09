import { Component, ElementRef, AfterViewInit, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';

@Component({
  selector: 'app-panthera',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './panthera.html',
  styleUrl: './panthera.scss',
})
export class Panthera implements AfterViewInit {

  private platformId = inject(PLATFORM_ID);

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) return;

    const bg = this.el.nativeElement.querySelector('#hero-bg');
    if (!bg) return;

    let lastScroll = 0;

    const onScroll = () => {
      lastScroll = window.scrollY;

      requestAnimationFrame(() => {
        const y = lastScroll * 0.25;
        const scale = 1.15;

        this.renderer.setStyle(
          bg,
          'transform',
          `translate3d(0, ${y}px, 0) scale(${scale})`
        );
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}