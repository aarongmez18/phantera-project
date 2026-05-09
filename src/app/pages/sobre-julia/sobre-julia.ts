import { Component, ElementRef, Renderer2, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sobre-julia',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './sobre-julia.html',
  styleUrl: './sobre-julia.scss',
})
export class SobreJulia implements AfterViewInit {

  @ViewChild('heroBg', { static: true }) heroBg!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    let lastY = 0;

    const onScroll = () => {
      lastY = window.scrollY;

      requestAnimationFrame(() => {
        // 👇 ESTE ES EL EFECTO REAL QUE QUIERES
        const y = lastY * 0.35;

        this.renderer.setStyle(
          this.heroBg.nativeElement,
          'transform',
          `translate3d(0, ${y}px, 0) scale(1.15)`
        );
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}