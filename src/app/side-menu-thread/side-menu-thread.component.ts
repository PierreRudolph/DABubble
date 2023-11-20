import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { SmileHelper } from 'src/moduls/smileHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { User } from 'src/moduls/user.class';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-side-menu-thread',
  templateUrl: './side-menu-thread.component.html',
  styleUrls: ['./side-menu-thread.component.scss']
})
export class SideMenuThreadComponent {
  i: 10 | number | undefined;

  @Input() userList: User[];
  @Input() user: User;
  public chathelper: ChatHepler = new ChatHepler();
  @Input() threadList: any = [this.chathelper.createEmptyThread()];
  @Input() threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  @Input() screenWidth: number;
  @Output() newSetOpen = new EventEmitter<boolean>();
  @Output() newItemEventOpenChat = new EventEmitter<boolean>();
  public textThreadEdit = "";
  public textThreadAnswer = "";
  // public textThreadAnswerEdit = "";
  public editA = false;
  public editAIndex = 0;
  private answerIndex = 0;
  public smileHelper: SmileHelper = new SmileHelper();
  public openChat: boolean;
  public addresses = false;

  showEmojisUpper: boolean | undefined;
  showEmojisLower: boolean | undefined;
  showEmojisTA: boolean | undefined;
  emojiText: string = "";

  @ViewChild('sideMenuThreadDiv')
  sideMenuThreadDiv: any;
  @ViewChild('drawer')
  drawer!: MatDrawer;
  // openEditDialog: boolean;
  // textEdit: any;

  constructor(public dialog: MatDialog) {
    setTimeout(() => {
      console.log("this user is", this.user);
    }, 500);
  }

  closeThread() {
    this.drawer.close();
    console.log(this.drawer);
    this.openChat = false;
    this.newItemEventOpenChat.emit(this.openChat);
    setTimeout(() => {
      //  this.newSetOpen.emit(false);
      //  this.drawer.open() 
    }, 300);
  }

  // closeThreadMobile() {
  //   this.drawer.close();
  // }

  /**
   * 
   * @returns Get the amount of answeres of a previously selected message. 
   */
  getAnswerLength() {
    return this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer.length;
  }

  /**   * 
  * @returns Get the list of answeres of a previously selected message. 
  */
  getAnswerList() {
    return this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer
  }

  /**    
   * @param index index of the answer
   * @param n     specific information of a answer that is represented as a JSON
   * @returns     Returns the given information of the given answer.
   */
  getAnswerData(index: number, n: string) {
    return this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index][n];
  }
  /**
   * Stores the given information in the given answer (represented by a JSON)
   * @param index index of the answer
   * @param n     specific information of a answer that is represented as a JSON
   * @param m     The data that shell be stored
   */
  setAnswerData(index: number, n: string, m: any) {
    this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index][n] = m;
  }

  /** 
   * @param index index of the answer
   * @returns     returns the list of commenticons of the answer
   */
  showSmilie(index: number) {
    return 0 != this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index].smile;
  }

  /**
   * @returns Returns the icon of the user, than sends the initial message that is opened in this thread window.
   */
  getIconPathQuestionUser() {
    let id = this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].iD;
    let path = "";
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path = u.iconPath;
      }
    });
    if (this.user.idDB == id) { path = this.user.iconPath; }
    return path;
  }

  /**
   * 
   * @param index   index of the answer
   * @returns       Returns the Image of a the user that gave the given answer
   */
  getImagePortrait(index: number) {
    let id = this.getAnswerData(index, 'iD');
    let path = "";
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path = u.iconPath;
      }
    });
    if (this.user.idDB == id) { path = this.user.iconPath; }
    return path;
  }

  makeAnswer() {
    let answ = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "smile": [],
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThreadAnswer,
      "messageSplits": this.chathelper.getLinkedUsers(this.user, this.userList, this.textThreadAnswer),
    }
    return answ;
  }

  /**
   * Saves the answer
   */
  saveAnswer() {
    let n = this.threadC.chNum;
    let i = this.threadC.coIndex;
    let j = this.threadC.thIndex;
    let threadId = this.threadList[n].channel.idDB;
    let answ = this.makeAnswer();

    if (this.editA) {
      this.threadList[n].communikation[i].threads[j].answer[this.editAIndex].message = this.textThreadAnswer;
      this.threadList[n].communikation[i].threads[j].answer[this.editAIndex].messageSplits = this.chathelper.getLinkedUsers(this.user, this.userList, this.textThreadAnswer);
    }
    else {
      this.threadList[n].communikation[i].threads[j].answer.push(answ);

    }
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[n].communikation });
    this.textThreadAnswer = "";
    this.editA = false;
  }

  /**
   * 
   * @param ans JSON of the answer that shell be edited
   * @param index  Index of the answer that shell be edited
   */
  openAnswerEditMode(ans: any, index: number) {
    this.editA = true;
    this.textThreadAnswer = ans.message;
    this.editAIndex = index;
  }

  /** 
   * @param answer JSON of the answer
   * @returns   returns wheather the answer is of the current user(useed for styling)
   */
  fromLoggedInUser(answer: any) {
    let uId = this.user.idDB;
    let aId = answer.iD;
    return (uId == aId);
  }

  /**
   * Stores a emoji for an answer
   * @param e JSON of the emoji
   */
  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let threadId = this.threadList[this.threadC.chNum].channel.idDB;
    console.log("answerIndex", this.answerIndex);
    let sm = this.getAnswerData(this.answerIndex, 'smile');

    let smileIndex = this.smileHelper.smileInAnswer(emoji, sm);
    if (smileIndex == -1) {
      let icon = {
        "icon": emoji,
        "users": [
          { "id": this.user.idDB }
        ]
      };
      sm.push(icon);
    } else {
      let usersIcon = sm[smileIndex].users;

      if (!this.smileHelper.isUserInSmile(usersIcon, this.user)) {
        sm[smileIndex].users.push({ "id": this.user.idDB });
      }
    }
    this.setAnswerData(this.answerIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.threadC.chNum].communikation });
    this.toggleEmojisUpperDialog(this.answerIndex);

  }

  toggleEmojisUpperDialog(aIndex: number) {
    this.showEmojisUpper = !this.showEmojisUpper;
    this.answerIndex = aIndex;
  }

  toggleEmojisLowerDialog(aIndex: number) {
    this.showEmojisLower = !this.showEmojisLower;
    this.answerIndex = aIndex;
  }

  /**
   * blends in or out the emoji popup vor the textarea.
   */
  toggleEmojisDialogTA() {
    this.showEmojisTA = !this.showEmojisTA;
  }

  /**
     * 
     * @param aIndex index of the answer where the emoji popUp shell be blend in
     * @returns 
     */
  showEmojiUpper(aIndex: number) {
    return (this.answerIndex === aIndex) && this.showEmojisUpper;
  }


  /**
   * 
   * @param aIndex index of the answer where the emoji popUp shell be blend in
   * @returns 
   */
  showEmojiLower(aIndex: number) {
    return (this.answerIndex === aIndex) && this.showEmojisLower;
  }

  /**
   * 
   * @param aIndex index of the answer where the emoji shell be deleted
   * @param sIndex 
   */
  removeSmile(aIndex: number, sIndex: number) {
    let threadId = this.threadList[this.threadC.chNum].channel.idDB;
    let userSmiles = this.getAnswerData(aIndex, 'smile');
    let newUserList = this.smileHelper.removeUser(userSmiles[sIndex].users, this.user)
    userSmiles[sIndex].users = newUserList;
    if (userSmiles[sIndex].users.length == 0) {
      userSmiles.splice(sIndex, 1);
    }
    this.setAnswerData(aIndex, 'smile', userSmiles);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.threadC.chNum].communikation });
  }

  /**
   * Saves the given emoji in the textarea 
   * @param e JSON on the emoji
   */
  saveEmojiTextArea(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));

    this.textThreadAnswer += emoji;
    this.showEmojisTA = false;
  }

  openSideMenuThread() {
    this.drawer.open();

    setTimeout(() => {
      this.showSideMenuMobile();
    }, 80);
  }

  showSideMenuMobile() {
    this.sideMenuThreadDiv.nativeElement.classList.remove('mobileDNone');
  }



  openMailAddresses() {
    this.addresses = !this.addresses;
  }


  openProfileOfUser(user: any) {
    let t = user.text.substring(1);
    if (this.user.name == t) { this.openDialog(this.user) }
    else {
      this.userList.forEach((u) => {
        if (u.name == t) { this.openDialog(u); }
      });
    }

  }

  chooseUser(u: User) {
    this.textThreadAnswer += '@' + u.name;
    this.addresses = !this.addresses;
  }

  openDialog(user: User): void {
    const dialogRef = this.dialog.open(UserProfileComponent);
    dialogRef.componentInstance.user = new User(user.toJSON());
    dialogRef.componentInstance.ref = dialogRef;
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  // /**
  //    * Blend in the popUp containing "Nachricht bearbeiten"
  //    */
  // openEditPopUp() {
  //   this.openEditDialog = !this.openEditDialog;
  // }


  // /**    
  //    * @param m JSON of data of a Channel-Message
  //    */
  // openEditWindow(m: any) {
  //   this.openEditDialog = !this.openEditDialog;
  //   m.edit = true;
  //   this.textEdit = m.message;
  // }
}