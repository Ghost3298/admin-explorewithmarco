import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseList } from './base-list';

describe('BaseList', () => {
  let component: BaseList;
  let fixture: ComponentFixture<BaseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
