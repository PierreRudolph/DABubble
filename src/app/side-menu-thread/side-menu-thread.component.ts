import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
@Component({
  selector: 'app-side-menu-thread',
  templateUrl: './side-menu-thread.component.html',
  styleUrls: ['./side-menu-thread.component.scss']
})
export class SideMenuThreadComponent {
  i: 10 | number | undefined;

  @ViewChild('drawer')
  drawer!: MatDrawer;

  closeThread() {
    this.drawer.close();
    console.log(this.drawer);
  }
}
