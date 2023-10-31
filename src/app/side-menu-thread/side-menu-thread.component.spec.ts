import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuThreadComponent } from './side-menu-thread.component';

describe('SideMenuThreadComponent', () => {
  let component: SideMenuThreadComponent;
  let fixture: ComponentFixture<SideMenuThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuThreadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
