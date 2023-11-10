import { Component, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent {
  public textThread = "";
  public number: number = 0;
  showEmojis: boolean | undefined;
  chanNamOnEdit: boolean | false;
  chanDescOnEdit: boolean | false;
  constructor(public dialog: MatDialog) { }

  openDialog(matDialogRef: TemplateRef<any>) {
    this.dialog.open(matDialogRef, { panelClass: 'dialog-bor-to-le-none' });
  }

  sendQuestion(n: number) {

  }

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
  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.textThread += emoji;
    console.log(emoji);
    this.toggleEmojisDialog();
  }

  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
  }
}
