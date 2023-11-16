import { Component ,Input} from '@angular/core';
import { PrivateMessageComponent } from '../private-message/private-message.component';

@Component({
  selector: 'app-send-new-message',
  templateUrl: './send-new-message.component.html',
  styleUrls: ['./send-new-message.component.scss']
})
export class SendNewMessageComponent {
  public newMessOpen = false;
  public text = "";
  public showEmojis = false;
 
 
  toggleEmojisDialog() { }

  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    if (this.showEmojis) {
      this.text += emoji;
      this.toggleEmojisDialog();
    }
    // if (this.showEmojisEdit) {
    //   this.textEdit += emoji;
    //   this.toggleEmojisDialogEdit()
    // }
  }

  saveMessage() {}

  /**
   * Saves the message stored in currentTalkData to the database. If it is the first message, that is starts a new talk.
   */
  // saveMessage() {
  //   let mes = this.createMessageFromText(this.text);
  //   console.log(mes)
  //   if (!this.exist) {
  //     this.startTalk(mes);
  //     this.exist = true;
  //   }
  //   else {
  //     this.saveMessageExist(mes);
  //   }
  //   setTimeout(() => {
  //     this.chatHepler.updateDB(this.currentTalkId, "talk", this.currentTalkData);
  //   }, 750);
  //   this.text = "";
  // }
}
