import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWindowComponent } from './channel-window.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog } from '@angular/cdk/dialog';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

describe('ChannelWindowComponent', () => {
  let component: ChannelWindowComponent;
  let fixture: ComponentFixture<ChannelWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule
      ],
      declarations: [ChannelWindowComponent],
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

    fixture = TestBed.createComponent(ChannelWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
