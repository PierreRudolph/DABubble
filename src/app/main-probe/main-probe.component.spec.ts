import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProbeComponent } from './main-probe.component';

describe('MainProbeComponent', () => {
  let component: MainProbeComponent;
  let fixture: ComponentFixture<MainProbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainProbeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainProbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
