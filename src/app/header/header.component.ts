import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
import { ScreenService } from '../screen.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() user: User = new User();
  @Input() userList: any;
  public chathelper: ChatHepler = new ChatHepler();
  @Input() threadList: any = [this.chathelper.createEmptyThread()];
  @Input() talkList: any = [this.chathelper.createEmptyTalk()];
  @Input() sideMenuHidden: boolean;
  public threadTitleDec: any[] = [];
  public threadMessages: any[] = [];
  public talkMessages: any[] = [];
  public userInfos: any;
  public text = "";
  public focus: boolean = false;
  public errorMessage: boolean = false;
  @Output() openSideMenu = new EventEmitter<boolean>();
  @Output() toggleSideMenu = new EventEmitter<boolean>();
  @Output() callOpenChannel = new EventEmitter<number>();
  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() isOpen = new EventEmitter<boolean>();

  constructor(public router: Router, public screen: ScreenService) { }


  searchKey(text: string) {
    this.errorMessage = false;
    this.text = text;
    if (!this.userList) {
      this.errorMessage = true;
      return
    }

    this.searchChannelNames(this.text);
    this.searchProfiles(this.text);
    this.searchChannelMessages(this.text);
    this.searchPrivateMess(this.text);
  }


  showPop() {
    return this.text != "";
  }


  searchChannelNames(text: string) {
    this.threadTitleDec = this.chathelper.searchChannelNames(text, this.threadList);
  }


  searchChannelMessages(text: string) {
    this.threadMessages = this.chathelper.searchChannelMessages(text, this.threadList);
  }


  async searchProfiles(text: string) {
    this.userInfos = this.chathelper.searchProfiles(text, this.userList, this.user);
  }


  searchPrivateMess(text: string) {
    this.talkMessages = this.chathelper.searchPrivateMess(text, this.talkList);
  }


  getOtherUser(info: any) {
    return this.chathelper.getOtherUser(info, this.userList, this.user);
  }


  getdate(info: any) {
    return this.threadList[info.num].communikation[info.cIndex].date;
  }


  getdateTalk(info: any) {
    return this.talkList[info.num].communikation[info.cIndex].date;
  }


  callOpenChan(n: number) {
    this.callOpenChannel.emit(n);
    this.isOpen.emit(false);
    this.clearInput();
  }


  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
    this.clearInput();
  }


  clearInput() {
    this.text = '';
  }


  toggleFocusBol() {
    setTimeout(() => {
      this.focus = !this.focus;
    }, 100);
  }


  emitToggleSideMenu() {
    this.sideMenuHidden = !this.sideMenuHidden;
    this.toggleSideMenu.emit(this.sideMenuHidden);
  }


  emitOpenSideMenu() {
    this.openSideMenu.emit();
  }


  showNormalHeader() {
    return ((this.screen.mobileScreenWidth()) && !this.sideMenuHidden) || this.screen.screenWidth > 830
  }


  showMobileHeader() {
    return (this.screen.mobileScreenWidth()) && this.sideMenuHidden;
  }
}
