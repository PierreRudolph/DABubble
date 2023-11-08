import { Component, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatHepler } from 'src/moduls/chatHelper.class';
@Component({
  selector: 'app-side-menu-thread',
  templateUrl: './side-menu-thread.component.html',
  styleUrls: ['./side-menu-thread.component.scss']
})
export class SideMenuThreadComponent {
  i: 10 | number | undefined;

  @Input() userList:any;
  private chathelper: ChatHepler = new ChatHepler();
  public threadList: any = [this.chathelper.createEmptyThread()];

  @ViewChild('drawer')
  drawer!: MatDrawer;

  closeThread() {
    this.drawer.close();
    console.log(this.drawer);
  }
}
