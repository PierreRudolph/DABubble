import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuComponent } from './side-menu.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogContainer, MatDialogModule } from '@angular/material/dialog';
import { DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog } from '@angular/cdk/dialog';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { TransformPipePipe } from '../transform-pipe.pipe';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSidenavModule, BrowserAnimationsModule, MatExpansionModule, FormsModule,],
      declarations: [SideMenuComponent],
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

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
