import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeopleDialogComponent } from './add-people-dialog.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog } from '@angular/cdk/dialog';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

describe('AddPeopleDialogComponent', () => {
  let component: AddPeopleDialogComponent;
  let fixture: ComponentFixture<AddPeopleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule
      ],
      declarations: [AddPeopleDialogComponent],
      providers: [MatDialogModule, MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER, { provide: Firestore, useValue: {} }]
    }).compileComponents();
    fixture = TestBed.createComponent(AddPeopleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
