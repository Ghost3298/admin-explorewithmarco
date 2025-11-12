import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bgnui } from './bgnui';

describe('Bgnui', () => {
  let component: Bgnui;
  let fixture: ComponentFixture<Bgnui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bgnui]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bgnui);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
