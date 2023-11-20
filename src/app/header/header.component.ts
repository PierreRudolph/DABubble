import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
import { SideMenuComponent } from '../side-menu/side-menu.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() user: User = new User();//authenticated user 
  @Input() userList: any;
  public chathelper: ChatHepler = new ChatHepler();
  @Input() threadList: any = [this.chathelper.createEmptyThread()];
  @Input() talkList: any = [this.chathelper.createEmptyTalk()]
  @Input() screenWidth: any;
  @Input() sideMenuHidden: boolean;
  private searchText: string = "";
  public threadTitleDec: any[] = [];
  public threadMessages: any[] = [];
  public talkMessages: any[] = [];
  public userInfos: any[] = [];
  public text = "";

  @Output() toggleSideMenu = new EventEmitter<boolean>();
  @Output() callOpenChannel = new EventEmitter<number>();
  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() isOpen = new EventEmitter<boolean>();



  constructor(public router: Router) {
    window.addEventListener("resize", this.resizeWindow);
  }


  showPop() {
    return this.text != "";
  }

  resizeWindow() {
    this.screenWidth = window.innerWidth;
  }

  searchKey(text: string) {
    this.text = text;
    this.searchChannelNames(this.text);
    this.searchProfiles(this.text);
    this.searchChannelMessages(this.text);
    this.searchPrivateMess(this.text);
  }

  searchChannelNames(text: string) {
    this.threadTitleDec = this.chathelper.searchChannelNames(text, this.threadList);
  }

  searchPrivateMess(text: string) {
    this.talkMessages = this.chathelper.searchPrivateMess(text, this.talkList);
  }

  getOtherUser(info: any) {  
    return this.chathelper.getOtherUser(info,this.userList,this.user);
  }


  callOpenChan(n: number) {
    console.log("call Cgan");
    this.callOpenChannel.emit(n);
    this.isOpen.emit(false);
  }

  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
  }


  searchChannelMessages(text: string) {
    this.threadMessages = this.chathelper.searchChannelMessages(text, this.threadList);
  }

  getdate(info: any) {
    return this.threadList[info.num].communikation[info.cIndex].date;
  }

  getdateTalk(info: any) {
    return this.talkList[info.num].communikation[info.cIndex].date;
  }

  searchProfiles(text: string) {
    this.userInfos = this.chathelper.searchProfiles(text, this.userList, this.user);
  }

  emitToggleSideMenu() {
    this.sideMenuHidden = !this.sideMenuHidden;
    this.toggleSideMenu.emit(this.sideMenuHidden);
  }

  showNormalHeader() {

    return (this.screenWidth < 830 && !this.sideMenuHidden) || this.screenWidth > 830
  }

  showMobileHeader() {
    return this.screenWidth < 830 && this.sideMenuHidden;
  }
}
