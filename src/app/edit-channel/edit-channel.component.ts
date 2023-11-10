import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {
  chanNamOnEdit: boolean | false;
  chanDescOnEdit: boolean | false;
  editChannelName() {
    this.toggleChanNameOnEdit();
  }

  saveNewChannelName() {
    this.toggleChanNameOnEdit();
  }

  toggleChanNameOnEdit() {
    this.chanNamOnEdit = !this.chanNamOnEdit;
  }

  editChannelDesc() {
    this.toggleChanDescOnEdit();
  }
  saveNewChannelDesc() {
    this.toggleChanDescOnEdit();
  }

  toggleChanDescOnEdit() {
    this.chanDescOnEdit = !this.chanDescOnEdit;
  }
}
