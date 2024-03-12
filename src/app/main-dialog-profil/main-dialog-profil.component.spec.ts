import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDialogProfilComponent } from './main-dialog-profil.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('MainDialogProfilComponent', () => {
  let component: MainDialogProfilComponent;
  let fixture: ComponentFixture<MainDialogProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase)

      ],
      declarations: [MainDialogProfilComponent],
      providers: [{ provide: Firestore, useValue: {} }]
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
