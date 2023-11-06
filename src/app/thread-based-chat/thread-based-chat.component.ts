import { Component } from '@angular/core';

@Component({
  selector: 'app-thread-based-chat',
  templateUrl: './thread-based-chat.component.html',
  styleUrls: ['./thread-based-chat.component.scss']
})
export class ThreadBasedChatComponent {

  createEmptyThred() {
    let t = {
      "channel":
      {
        "name": "",
        "description": "",
        "members": [{
          "memberName":"",
          "memberID":"",
        }] 
      },
      "communikation": [
        {
          "date": "",
          "threds": [
            {
              "name": "",
              "iD": "", //of person that writes the message
              "edit": false,
              "time": "",
              "message": "",
            }
          ]
        }]
    }
  }

}
