import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreJulia } from './sobre-julia';

describe('SobreJulia', () => {
  let component: SobreJulia;
  let fixture: ComponentFixture<SobreJulia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreJulia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreJulia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
