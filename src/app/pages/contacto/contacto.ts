import {
  Component,
  ElementRef,
  Renderer2,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from '@emailjs/browser';

import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll';
import { environment } from '../../../enviroments';

@Component({
  selector: 'app-contacto',
  imports: [
    CommonModule,
    FormsModule,
    RevealOnScrollDirective
  ],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto implements AfterViewInit, OnDestroy {

  @ViewChild('heroBg', { static: true })
  heroBg!: ElementRef<HTMLElement>;

  form = {
    nombre: '',
    email: '',
    mensaje: '',
  };

  isSending = false;
  isSent = false;
  isError = false;
  hasSubmitted = false;

  validationErrors: string[] = [];

  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private isBrowser = false;
  private scrollRaf = 0;
  private removeScrollListener: (() => void) | null = null;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) return;

    this.initParallax();
  }

  ngOnDestroy(): void {
    if (this.removeScrollListener) {
      this.removeScrollListener();
      this.removeScrollListener = null;
    }

    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = 0;
    }
  }

  private initParallax(): void {
    let lastY = 0;

    const onScroll = () => {
      lastY = window.scrollY;

      if (this.scrollRaf) return;

      this.scrollRaf = requestAnimationFrame(() => {
        const y = lastY * 0.35;

        this.renderer.setStyle(
          this.heroBg.nativeElement,
          'transform',
          `translate3d(0, ${y}px, 0) scale(1.15)`
        );

        this.scrollRaf = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    this.removeScrollListener = () => {
      window.removeEventListener('scroll', onScroll);
    };

    onScroll();
  }

  async enviarFormulario(formDirective: NgForm): Promise<void> {
    if (this.isSending) return;

    this.hasSubmitted = true;
    this.isError = false;
    this.isSent = false;
    this.validationErrors = [];

    const nombre = this.form.nombre.trim();
    const email = this.form.email.trim();
    const mensaje = this.form.mensaje.trim();

    this.validationErrors = this.validarDatosFormulario(nombre, email, mensaje);

    if (formDirective.invalid || this.validationErrors.length > 0) {
      formDirective.control.markAllAsTouched();
      this.isError = true;
      return;
    }

    this.isSending = true;
    this.cdr.detectChanges();

    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          from_name: nombre,
          from_email: email,
          message: mensaje
        },
        environment.emailjs.publicKey
      );

      this.isSent = true;
      this.isError = false;
      this.validationErrors = [];
      this.hasSubmitted = false;

      formDirective.resetForm({
        nombre: '',
        email: '',
        mensaje: ''
      });

      this.form = {
        nombre: '',
        email: '',
        mensaje: ''
      };

    } catch (e) {
      this.isError = true;
      this.validationErrors = [
        'No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos.'
      ];
      console.error(e);

    } finally {
      this.isSending = false;
      this.cdr.detectChanges();
    }
  }

  private validarDatosFormulario(
    nombre: string,
    email: string,
    mensaje: string
  ): string[] {
    const errors: string[] = [];

    if (!nombre) {
      errors.push('El nombre es obligatorio.');
    } else if (nombre.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres.');
    } else if (nombre.length > 80) {
      errors.push('El nombre no puede superar los 80 caracteres.');
    }

    if (!email) {
      errors.push('El correo electrónico es obligatorio.');
    } else if (!this.emailRegex.test(email)) {
      errors.push('Introduce un correo electrónico válido.');
    } else if (email.length > 120) {
      errors.push('El correo electrónico no puede superar los 120 caracteres.');
    }

    if (!mensaje) {
      errors.push('El mensaje es obligatorio.');
    } else if (mensaje.length < 10) {
      errors.push('El mensaje debe tener al menos 10 caracteres.');
    } else if (mensaje.length > 1000) {
      errors.push('El mensaje no puede superar los 1000 caracteres.');
    }

    return errors;
  }
}