import { Component, Input } from '@angular/core';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-thread-based-chat',
  templateUrl: './thread-based-chat.component.html',
  styleUrls: ['./thread-based-chat.component.scss']
})
export class ThreadBasedChatComponent {
  @Input() userList: any;
  @Input() user: User;

  

}
