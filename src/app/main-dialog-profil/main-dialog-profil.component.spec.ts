import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogProfilComponent } from './main-dialog-profil.component';

describe('MainDialogProfilComponent', () => {
  let component: MainDialogProfilComponent;
  let fixture: ComponentFixture<MainDialogProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDialogProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDialogProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
