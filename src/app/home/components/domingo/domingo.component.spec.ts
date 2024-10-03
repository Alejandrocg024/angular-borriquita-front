import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomingoComponent } from './domingo.component';

describe('DomingoComponent', () => {
  let component: DomingoComponent;
  let fixture: ComponentFixture<DomingoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomingoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
