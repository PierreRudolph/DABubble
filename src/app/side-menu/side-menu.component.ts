import { Component, Input } from '@angular/core';
import { User } from 'src/moduls/user.class';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  menuHidden: boolean | true | undefined;
  chPanelOpen: boolean | undefined;
  mesPanelOpen: boolean | undefined;
  @Input() user:User = new User();
  @Input() userList=[this.user];

 
}
