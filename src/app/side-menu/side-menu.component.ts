import { Component } from '@angular/core';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  menuHidden: boolean | true | undefined;
  chPanelOpen: boolean | undefined;
  mesPanelOpen: boolean | undefined;
}
