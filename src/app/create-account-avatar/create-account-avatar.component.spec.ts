import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountAvatarComponent } from './create-account-avatar.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('CreateAccountAvatarComponent', () => {
  let component: CreateAccountAvatarComponent;
  let fixture: ComponentFixture<CreateAccountAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase)

      ],
      declarations: [CreateAccountAvatarComponent],
      providers: [{ provide: Firestore, useValue: {} }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateAccountAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
