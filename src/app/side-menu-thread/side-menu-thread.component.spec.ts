import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuThreadComponent } from './side-menu-thread.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog } from '@angular/cdk/dialog';
import { Firestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TransformPipePipe } from '../transform-pipe.pipe';


describe('SideMenuThreadComponent', () => {
  let component: SideMenuThreadComponent;
  let fixture: ComponentFixture<SideMenuThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSidenavModule, BrowserAnimationsModule, FormsModule
      ],
      declarations: [SideMenuThreadComponent, TransformPipePipe],
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

    fixture = TestBed.createComponent(SideMenuThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
