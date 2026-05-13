import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-servicios',
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class Servicios implements AfterViewInit, OnDestroy {

  @ViewChild('heroBg', { static: true })
  heroBg!: ElementRef;

  @ViewChild('cardsContainer')
  cardsContainer!: ElementRef<HTMLDivElement>;

  private autoScroll: any;

  private cardWidth = 0;

  private isResetting = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    this.initParallax();

    setTimeout(() => {
      this.initInfiniteCarousel();
    }, 100);
  }

  ngOnDestroy(): void {
    clearInterval(this.autoScroll);
  }

  initParallax() {

    let lastY = 0;
    let ticking = false;

    const onScroll = () => {

      lastY = window.scrollY;

      if (!ticking) {

        requestAnimationFrame(() => {

          const y = lastY * 0.35;

          this.renderer.setStyle(
            this.heroBg.nativeElement,
            'transform',
            `translate3d(0, ${y}px, 0) scale(1.15)`
          );

          ticking = false;

        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  scrollCards(direction: 'left' | 'right') {

    const container = this.cardsContainer.nativeElement;

    const amount = this.cardWidth;

    container.scrollBy({
      left: direction === 'right'
        ? amount
        : -amount,
      behavior: 'smooth'
    });
  }

  initInfiniteCarousel() {

    const container = this.cardsContainer.nativeElement;

    const originalCards =
      Array.from(container.querySelectorAll('.service-card'));

    if (!originalCards.length) return;

    originalCards.forEach(card => {

      const clone = card.cloneNode(true) as HTMLElement;

      clone.classList.add('clone-card');

      container.appendChild(clone);
    });

    const firstCard =
      container.querySelector('.service-card') as HTMLElement;

    const gap = 24;

    this.cardWidth = firstCard.offsetWidth + gap;

    const originalWidth =
      this.cardWidth * originalCards.length;

    container.scrollLeft = originalWidth;
container.addEventListener('scroll', () => {

  if (this.isResetting) return;

  const maxScroll =
    container.scrollWidth - container.clientWidth;

  /*
    Llegó al inicio real
  */
  if (container.scrollLeft <= 5) {

    this.isResetting = true;

    container.style.scrollBehavior = 'auto';

    container.scrollLeft =
      container.scrollLeft + originalWidth;

    requestAnimationFrame(() => {

      container.style.scrollBehavior = 'smooth';

      this.isResetting = false;
    });
  }

  /*
    Llegó al final real
  */
  else if (container.scrollLeft >= maxScroll - 5) {

    this.isResetting = true;

    container.style.scrollBehavior = 'auto';

    container.scrollLeft =
      container.scrollLeft - originalWidth;

    requestAnimationFrame(() => {

      container.style.scrollBehavior = 'smooth';

      this.isResetting = false;
    });
  }
});

    this.startAutoScroll();

    container.addEventListener('mouseenter', () => {
      clearInterval(this.autoScroll);
    });

    container.addEventListener('mouseleave', () => {
      this.startAutoScroll();
    });
  }

  startAutoScroll() {

    clearInterval(this.autoScroll);

    this.autoScroll = setInterval(() => {

      const container = this.cardsContainer.nativeElement;

      container.scrollBy({
        left: this.cardWidth,
        behavior: 'smooth'
      });

    }, 4500);
  }
}