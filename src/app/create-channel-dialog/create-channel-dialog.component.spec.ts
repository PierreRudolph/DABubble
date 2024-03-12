import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelDialogComponent } from './create-channel-dialog.component';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
describe('CreateChannelDialogComponent', () => {
  let component: CreateChannelDialogComponent;
  let fixture: ComponentFixture<CreateChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CreateChannelDialogComponent],
      providers: [MatDialogModule, MatDialog, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
