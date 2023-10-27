import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountAvatarComponent } from './create-account-avatar.component';

describe('CreateAccountAvatarComponent', () => {
  let component: CreateAccountAvatarComponent;
  let fixture: ComponentFixture<CreateAccountAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountAvatarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
