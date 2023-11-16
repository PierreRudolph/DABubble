import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNewMessageComponent } from './send-new-message.component';

describe('SendNewMessageComponent', () => {
  let component: SendNewMessageComponent;
  let fixture: ComponentFixture<SendNewMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendNewMessageComponent ]
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
