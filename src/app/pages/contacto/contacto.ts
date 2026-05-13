import { Component, ElementRef, Renderer2, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ChangeDetectorRef } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';
import { environment } from '../../../enviroments';

@Component({
  selector: 'app-contacto',
  imports: [
    RevealOnScrollDirective,
    CommonModule,
    FormsModule
  ],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto implements AfterViewInit {

  @ViewChild('heroBg', { static: true }) heroBg!: ElementRef;

  form = {
    nombre: '',
    email: '',
    mensaje: '',
  };

  isSending = false;
  isSent = false;
  isError = false;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    let lastY = 0;

    const onScroll = () => {
      lastY = window.scrollY;

      requestAnimationFrame(() => {
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

async enviarFormulario() {

  if (this.isSending) return;

  this.isSending = true;
  this.isError = false;
  this.isSent = false;

  this.cdr.detectChanges();

  try {

    await emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      {
        from_name: this.form.nombre,
        from_email: this.form.email,
        message: this.form.mensaje
      },
      environment.emailjs.publicKey
    );

    this.isSent = true;

    this.form = {
      nombre: '',
      email: '',
      mensaje: ''
    };

  } catch (e) {

    this.isError = true;
    console.error(e);

  } finally {

    this.isSending = false;
    this.cdr.detectChanges(); // 👈 clave también aquí
  }
}
}