import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { ChatHepler } from 'src/moduls/chatHelper.class';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  //let mockChatHelper: Partial<ChatHepler>;
  beforeEach(async () => {

    // mockChatHelper = {
    //   searchChannelNames: jasmine.createSpy('searchChannelNames').and.returnValue('MockThreadTitleDec')
    // };

    await TestBed.configureTestingModule({

      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule
      ],
      declarations: [HeaderComponent],
      providers: [{ provide: Firestore, useValue: {} }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if text is not empty', () => {
    component.text = "Some text";
    expect(component.showPop()).toBeTruthy();
  })

  it('should return false if text is empty', () => {
    component.text = "";
    expect(component.showPop()).toBeFalsy();
  })

  it('should make text to a empty string', () => {
    component.text = "Some text";
    component.clearInput();
    expect(component.text).toBe("")
  })

  // it('should set threadTitleDesc with the result of searchChannelNames', () => {
  //   const text = 'ChannelName';
  //   const threadList = ['ChannelName1', 'ChannelName2'];
  //   component.searchChannelNames(text);

  //   // Expect searchChannelNames to be called with the provided arguments
  //   expect(mockChatHelper.searchChannelNames).toHaveBeenCalledWith(text, threadList);

  //   // Expect threadTitleDec to be set with the result of searchChannelNames
  //   expect(component.threadTitleDesc).toEqual('MockThreadTitleDec');
  // });
});
