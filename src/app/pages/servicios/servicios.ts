import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './servicios.html',
  styleUrl: './servicios.scss',
})
export class Servicios implements AfterViewInit, OnDestroy {

  @ViewChild('heroBg', { static: true })
  heroBg!: ElementRef<HTMLElement>;

  @ViewChild('cardsContainer')
  cardsContainer!: ElementRef<HTMLDivElement>;

  dots = [0, 1, 2, 3];

  activeIndex = 0;

  private autoScroll: ReturnType<typeof setInterval> | null = null;

  private scrollRaf = 0;

  private resizeRaf = 0;

  private parallaxRaf = 0;

  private isBrowser = false;

  private destroyed = false;

  private prefersReducedMotion = false;

  private removeListeners: Array<() => void> = [];

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) return;

    this.prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initParallax();
    this.initCarousel();
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    this.pauseAutoScroll();

    this.removeListeners.forEach(remove => remove());
    this.removeListeners = [];

    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
    }

    if (this.resizeRaf) {
      cancelAnimationFrame(this.resizeRaf);
    }

    if (this.parallaxRaf) {
      cancelAnimationFrame(this.parallaxRaf);
    }
  }

  private initParallax(): void {
    if (this.prefersReducedMotion) return;

    let lastY = 0;

    const onScroll = () => {
      lastY = window.scrollY;

      if (this.parallaxRaf) return;

      this.parallaxRaf = requestAnimationFrame(() => {
        const y = lastY * 0.35;

        this.renderer.setStyle(
          this.heroBg.nativeElement,
          'transform',
          `translate3d(0, ${y}px, 0) scale(1.15)`
        );

        this.parallaxRaf = 0;
      });
    };

    this.addListener(window, 'scroll', onScroll, { passive: true });

    onScroll();
  }

  private initCarousel(): void {
    setTimeout(() => {
      this.syncActiveIndex();
      this.startAutoScroll();
    }, 150);

    this.addListener(window, 'resize', () => {
      this.onResize();
    });

    this.addListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoScroll();
      } else {
        this.resumeAutoScroll();
      }
    });
  }

  onCarouselScroll(): void {
    if (!this.isBrowser) return;

    if (this.scrollRaf) return;

    this.scrollRaf = requestAnimationFrame(() => {
      this.syncActiveIndex();
      this.scrollRaf = 0;
    });
  }

  scrollCards(direction: 'left' | 'right'): void {
    const total = this.dots.length;

    if (!total) return;

    let nextIndex =
      direction === 'right'
        ? this.activeIndex + 1
        : this.activeIndex - 1;

    if (nextIndex >= total) {
      nextIndex = 0;
    }

    if (nextIndex < 0) {
      nextIndex = total - 1;
    }

    this.goToCard(nextIndex);
    this.restartAutoScroll();
  }

  goToCard(index: number, behavior: ScrollBehavior = 'smooth'): void {
    if (!this.isBrowser) return;

    const container = this.cardsContainer?.nativeElement;
    const cards = this.getCards();

    if (!container || !cards.length || !cards[index]) return;

    const card = cards[index];

    const left =
      card.offsetLeft -
      ((container.clientWidth - card.clientWidth) / 2);

    this.activeIndex = index;

    container.scrollTo({
      left,
      behavior: this.prefersReducedMotion ? 'auto' : behavior
    });
  }

  onCarouselKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.scrollCards('right');
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.scrollCards('left');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.goToCard(0);
      this.restartAutoScroll();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.goToCard(this.dots.length - 1);
      this.restartAutoScroll();
    }
  }

  pauseAutoScroll(): void {
    if (this.autoScroll) {
      clearInterval(this.autoScroll);
      this.autoScroll = null;
    }
  }

  resumeAutoScroll(): void {
    if (!this.isBrowser || this.destroyed || document.hidden) return;

    this.startAutoScroll();
  }

  private startAutoScroll(): void {
    if (!this.isBrowser || this.prefersReducedMotion || this.destroyed) return;

    this.pauseAutoScroll();

    this.autoScroll = setInterval(() => {
      this.scrollCards('right');
    }, 5500);
  }

  private restartAutoScroll(): void {
    if (this.prefersReducedMotion) return;

    this.startAutoScroll();
  }

  private syncActiveIndex(): void {
    const container = this.cardsContainer?.nativeElement;
    const cards = this.getCards();

    if (!container || !cards.length) return;

    const containerCenter =
      container.scrollLeft + container.clientWidth / 2;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter =
        card.offsetLeft + card.offsetWidth / 2;

      const distance =
        Math.abs(cardCenter - containerCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    this.activeIndex = nearestIndex;
  }

  private onResize(): void {
    if (this.resizeRaf) return;

    this.resizeRaf = requestAnimationFrame(() => {
      this.goToCard(this.activeIndex, 'auto');
      this.resizeRaf = 0;
    });
  }

  private getCards(): HTMLElement[] {
    const container = this.cardsContainer?.nativeElement;

    if (!container) return [];

    return Array.from(
      container.querySelectorAll<HTMLElement>('.service-card')
    );
  }

  private addListener(
    target: EventTarget,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(eventName, handler, options);

    this.removeListeners.push(() => {
      target.removeEventListener(eventName, handler, options);
    });
  }
}