import { Component, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditChannelComponent } from '../edit-channel/edit-channel.component';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent {
  public textThread = "";
  public number: number = 0;
  showEmojis: boolean | undefined;
  editDialogOpen: boolean | undefined;

  constructor(public dialog: MatDialog) {

  }
  openDialog() {
    this.dialog.open(EditChannelComponent, { panelClass: 'dialog-bor-to-le-none', position: { left: '445px', top: '190px' } })
      .afterClosed().subscribe(() => {
        this.editDialogOpen = !this.editDialogOpen;
      });
    this.editDialogOpen = !this.editDialogOpen;
  }

  sendQuestion(n: number) {

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
