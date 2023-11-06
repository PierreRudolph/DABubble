import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadBasedChatComponent } from './thread-based-chat.component';

describe('ThreadBasedChatComponent', () => {
  let component: ThreadBasedChatComponent;
  let fixture: ComponentFixture<ThreadBasedChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadBasedChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadBasedChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
