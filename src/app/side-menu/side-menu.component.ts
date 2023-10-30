import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  showFiller: boolean | undefined;
  menuHidden: boolean | true | undefined;
  channelsPanelOpen: boolean | false | undefined;
  chPanelOpen: boolean | undefined;
}
