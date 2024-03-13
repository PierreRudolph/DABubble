import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMessageComponent } from './private-message.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog } from '@angular/cdk/dialog';
import { FormGroup, FormsModule } from '@angular/forms';

describe('PrivateMessageComponent', () => {
  let component: PrivateMessageComponent;
  let fixture: ComponentFixture<PrivateMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule
      ],
      declarations: [PrivateMessageComponent],
      providers: [
        MatDialogModule,
        MatDialog,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        Dialog,
        DIALOG_SCROLL_STRATEGY_PROVIDER,
        { provide: Firestore, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PrivateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
