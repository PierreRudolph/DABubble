import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNewMessageComponent } from './send-new-message.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('SendNewMessageComponent', () => {
  let component: SendNewMessageComponent;
  let fixture: ComponentFixture<SendNewMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),

      ],
      declarations: [SendNewMessageComponent],
      providers: [{ provide: Firestore, useValue: {} }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SendNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
