import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panthera } from './panthera';

describe('Panthera', () => {
  let component: Panthera;
  let fixture: ComponentFixture<Panthera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panthera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panthera);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
