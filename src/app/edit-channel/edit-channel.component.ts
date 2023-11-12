import { Component } from '@angular/core';
import { ChatHepler } from 'src/moduls/chatHelper.class';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {
  chanNamOnEdit: boolean | false;
  chanDescOnEdit: boolean | false;
  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread().channel;


  constructor() {
    setTimeout(() => {
      console.log("Channel is", this.channel);

    }, 1000);
  }

  editChannelName() {
    this.toggleChanNameOnEdit();
  }

  saveNewChannelName() {
    let value = (document.getElementById("nameChannel") as HTMLInputElement | null)?.value;
    this.channel.name = value;
    this.chathelper.updateDB(this.channel.idDB,"thread",{"channel":this.channel});
    this.toggleChanNameOnEdit();
  }

  toggleChanNameOnEdit() {
    this.chanNamOnEdit = !this.chanNamOnEdit;
  }

  editChannelDesc() {
    this.toggleChanDescOnEdit();
  }
  saveNewChannelDesc() {
    let value = (document.getElementById("description") as HTMLInputElement | null)?.value;
    this.channel.description = value;
    this.chathelper.updateDB(this.channel.idDB,"thread",{"channel":this.channel});
    this.toggleChanDescOnEdit();
  }

  toggleChanDescOnEdit() {
    this.chanDescOnEdit = !this.chanDescOnEdit;
  }
}
