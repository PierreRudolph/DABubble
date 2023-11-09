import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWindowComponent } from './channel-window.component';

describe('ChannelWindowComponent', () => {
  let component: ChannelWindowComponent;
  let fixture: ComponentFixture<ChannelWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelWindowComponent ]
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
