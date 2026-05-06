import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealAnimation = 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade-in';

@Directive({
  selector: '[reveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input('reveal') animation: RevealAnimation = 'fade-up';
  @Input() revealDelay = 0;

  private observer?: IntersectionObserver;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;

    this.renderer.addClass(element, 'reveal');
    this.renderer.addClass(element, `reveal-${this.animation}`);
    this.renderer.setStyle(element, 'transition-delay', `${this.revealDelay}ms`);

    if (!isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(element, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(element, 'is-visible');
          this.observer?.unobserve(element);
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}