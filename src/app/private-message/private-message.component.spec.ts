import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMessageComponent } from './private-message.component';

describe('PrivateMessageComponent', () => {
  let component: PrivateMessageComponent;
  let fixture: ComponentFixture<PrivateMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateMessageComponent ]
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
