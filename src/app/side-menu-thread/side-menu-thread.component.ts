import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { SmileHelper } from 'src/moduls/smileHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { User } from 'src/moduls/user.class';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { ScreenService } from '../screen.service';
@Component({
  selector: 'app-side-menu-thread',
  templateUrl: './side-menu-thread.component.html',
  styleUrls: ['./side-menu-thread.component.scss']
})
export class SideMenuThreadComponent {
  i: 10 | number | undefined;

  @Input() userList: Array<User> = [];
  @Input() user: User;
  public chathelper: ChatHepler = new ChatHepler();
  @Input() channelList: any = [this.chathelper.createEmptyThread()];
  @Input() threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  @Input() channelOpen: boolean;
  @Input() sideMenuHidden: boolean;
  @Output() newSetOpen = new EventEmitter<boolean>();
  @Output() newItemEventOpenChat = new EventEmitter<boolean>();
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() areaTextPrivate = new EventEmitter<string>();
  private text: string = "";
  public textThreadEdit = "";
  public textThreadAnswer = "";
  // public textThreadAnswerEdit = "";
  public editA = false;
  public editAIndex = 0;
  private answerIndex = 0;
  public smileHelper: SmileHelper = new SmileHelper();
  public openChat: boolean = true;
  public addresses = false;
  public dataUploadThread = { "link": "", "title": "" };
  private clickInsideEmoji: boolean = false
  showEmojisUpper: boolean | undefined = false;
  showEmojisLower: boolean | undefined;
  showEmojisTA: boolean | undefined;
  showEmojisTAEdit: boolean | undefined;
  openEditDialog = false;
  emojiText: string = "";
  smileEdit: boolean = false;
  public popUpText = { "du": "", "first": "", "other": "", "verb": "" }

  @ViewChild('sideMenuThreadDiv')
  sideMenuThreadDiv: any;
  @ViewChild('drawer')
  drawer!: MatDrawer;
  private upload: any;
  private tA: any;
  // openEditDialog: boolean;
  // textEdit: any;

  constructor(public dialog: MatDialog, public screen: ScreenService) {

    setTimeout(() => {
      this.upload = (document.getElementById("imgthread") as HTMLInputElement | null);
      this.tA = (document.getElementById("threadWindow") as HTMLInputElement | null);
      if (this.tA) { this.tA.scrollTo({ top: this.tA.scrollHeight, behavior: 'smooth' }); }
      this.handleMobileThreadView();
    }, 1000);
  }


  handleMobileThreadView() {
    addEventListener("resize", () => {
      if (this.screen.callResize() > 1400 && !this.channelOpen && this.openChat) {
        this.closeThread();
      }
      if (this.screen.callResize() <= 850 && this.openChat && !this.channelOpen && !this.sideMenuHidden) {
        this.closeThread();
      }
    });
  }

  closeThread() {
    this.drawer.close();
    this.openChat = false;
    this.newItemEventOpenChat.emit(this.openChat);
  }

  /**
   * 
   * @returns Get the amount of answeres of a previously selected message. 
   */
  getAnswerLength() {
    return this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer.length;
  }

  /**   * 
  * @returns Get the list of answeres of a previously selected message. 
  */
  getAnswerList() {
    return this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer
  }

  /**    
   * @param index index of the answer
   * @param n     specific information of a answer that is represented as a JSON
   * @returns     Returns the given information of the given answer.
   */
  getAnswerData(index: number, n: string) {
    return this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index][n];
  }
  /**
   * Stores the given information in the given answer (represented by a JSON)
   * @param index index of the answer
   * @param n     specific information of a answer that is represented as a JSON
   * @param m     The data that shell be stored
   */
  setAnswerData(index: number, n: string, m: any) {
    this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index][n] = m;
  }

  /** 
   * @param index index of the answer
   * @returns     returns the list of commenticons of the answer
   */
  showSmilie(index: number) {
    return 0 != this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index].smile;
  }

  /**
   * @returns Returns the icon of the user, than sends the initial message that is opened in this thread window.
   */
  getIconPathQuestionUser() {
    let id = this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].iD;
    let path = "";

    if (this.userList.length > 0) {//if abfrage fürs testing
      this.userList.forEach((u) => {
        if (u.idDB == id) {
          path = u.iconPath;
        }
      });
    }
    if (this.user) {//if abfrage fürs testing
      if (this.user.idDB == id) { path = this.user.iconPath; }
    }

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
    if (this.user) {//if abfrage fürs testing
      if (this.user.idDB == id) { path = this.user.iconPath; }
    }
    return path;
  }

  makeAnswer() {
    let answ = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "smile": [],
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "url": { "link": this.dataUploadThread.link, "title": this.dataUploadThread.title },
      "message": this.textThreadAnswer,
      "messageSplits": this.chathelper.getLinkedUsers(this.user, this.userList, this.textThreadAnswer),
    }
    this.dataUploadThread.link = "";
    this.dataUploadThread.title = "";
    return answ;
  }

  keyDownFunction(input: any) {
    if (input.key == "Enter" && !input.shiftKey) {
      input.preventDefault();
      this.saveAnswer();
    }
  }

  /**
   * Saves the answer
   */
  saveAnswer() {
    if (this.textThreadAnswer == "" && this.dataUploadThread.link == "") { return; }
    let n = this.threadC.chNum;
    let i = this.threadC.coIndex;
    let j = this.threadC.thIndex;
    let threadId = this.channelList[n].channel.idDB;
    let answ = this.makeAnswer();
    this.channelList[n].communikation[i].threads[j].answer.push(answ);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.channelList[n].communikation });
    this.textThreadAnswer = "";
    this.editA = false;
  }

  toggleEmojisDialogEdit(event: any, aIndex: number) {
    event.stopPropagation();
    this.editAIndex = aIndex;
    this.smileEdit = !this.smileEdit;
  }

  showSmile(aIndex: number) {
    return this.smileEdit && (aIndex == this.editAIndex);
  }

  /**
 * 
 * @param m JSON of data of a Thread
 * @returns Returns wheather the person that wrote the thread is the current user. Important for styling.
 */
  getFlip(m: any) {
    if (this.user) {//if abfrage fürs testing
      return m.iD == this.user.idDB;

    } else {
      return false
    }
  }

  /**
   * Saves the edited answer
   */
  saveEdit() {
    let n = this.threadC.chNum;
    let i = this.threadC.coIndex;
    let j = this.threadC.thIndex;
    this.channelList[n].communikation[i].threads[j].answer[this.editAIndex].message = this.textThreadEdit;
    this.channelList[n].communikation[i].threads[j].answer[this.editAIndex].messageSplits = this.chathelper.getLinkedUsers(this.user, this.userList, this.textThreadEdit);
    this.editA = false;

    if (this.textThreadEdit == "" && this.channelList[n].communikation[i].threads[j].answer[this.editAIndex].url.link == "") {
      this.deleteMessage(this.editAIndex);
    } else {
      this.chathelper.updateDB(this.channelList[n].channel.idDB, 'thread', { "communikation": this.channelList[n].communikation });
    }
  }

  /** * 
* @param e JSON of the emoji that should be shown in the message-edit within the channel
*/
  saveEmojiEdit(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.textThreadEdit += emoji;
    this.smileEdit = !this.smileEdit;
  }

  /**
   * 
   * @param ans JSON of the answer that shell be edited
   * @param index  Index of the answer that shell be edited
   */
  openAnswerEditMode(ans: any, index: number) {
    this.editA = true;
    this.openEditDialog = false;
    this.textThreadEdit = ans.message;
    this.editAIndex = index;
  }

  showEdit(aIndex: number) {
    return this.editA && (this.editAIndex == aIndex);
  }

  closeEdit() {
    this.editA = false;
  }

  /** 
   * @param answer JSON of the answer
   * @returns   returns wheather the answer is of the current user(useed for styling)
   */
  fromLoggedInUser(answer: any) {
    let uId = "";
    let aId = "";
    if (this.user) {//if abfrage fürs testing
      uId = this.user.idDB;
      aId = answer.iD;
    }
    return (uId == aId);
  }

  /**
   * Stores a emoji for an answer
   * @param e JSON of the emoji
   */
  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let threadId = this.channelList[this.threadC.chNum].channel.idDB;
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
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.channelList[this.threadC.chNum].communikation });
    this.showEmojisUpper = false;
    this.showEmojisLower = false;


  }

  toggleEmojisUpperDialog(event: any, aIndex: number) {
    event.stopPropagation();
    this.showEmojisUpper = !this.showEmojisUpper;
    this.answerIndex = aIndex;
  }

  toggleEmojisLowerDialog(event: any, aIndex: number) {
    event.stopPropagation();
    this.showEmojisLower = !this.showEmojisLower;
    this.answerIndex = aIndex;
  }

  /**
   * blends in or out the emoji popup vor the textarea.
   */
  toggleEmojisDialogTA(event: any) {
    event.stopPropagation();
    this.showEmojisTA = !this.showEmojisTA;
  }

  /**
   * blends in or out the emoji popup vor the textarea.
   */
  toggleEmojisDialogTAEdit(aIndex: number) {
    this.editAIndex = aIndex;
    this.showEmojisTAEdit = !this.showEmojisTAEdit;
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
    let threadId = this.channelList[this.threadC.chNum].channel.idDB;
    let userSmiles = this.getAnswerData(aIndex, 'smile');
    let newUserList = this.smileHelper.removeUser(userSmiles[sIndex].users, this.user)
    userSmiles[sIndex].users = newUserList;
    if (userSmiles[sIndex].users.length == 0) {
      userSmiles.splice(sIndex, 1);
    }
    this.setAnswerData(aIndex, 'smile', userSmiles);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.channelList[this.threadC.chNum].communikation });
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
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.callOpenT(user);
      }
    });
  }

  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
    this.isOpen.emit(false);
    this.areaTextPrivate.emit(this.text);
  }

  showPopUpCommentUsers(aIndex: number, sIndex: number) {
    let smile = this.channelList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[aIndex].smile[sIndex];
    let smileUsers = [];
    smile.users.forEach((s) => {
      smileUsers.push(s.id);
    });
    this.popUpText = this.smileHelper.showPopUpCommentUsers(smileUsers, this.user, this.userList);
  }

  showBlendin(attr: string) {
    return this.popUpText[attr] != "";
  }

  showBlendIn() {
    return this.dataUploadThread.link != "";
  }

  /**
 * Saves the uploaded portrait.
 * @param event Uploaded file
 */
  async onSelection(event: any) {
    await this.chathelper.onSelect(event, this.dataUploadThread);
    this.upload.value = "";
  }

  showLink(link: string) {
    return link != "";
  }

  closeUpload() {
    this.deleteFileFromStorage(this.dataUploadThread.title);
    this.dataUploadThread.link = "";
    this.dataUploadThread.title = "";
  }

  /**
* Blend in the popUp containing "Nachricht bearbeiten"
*/
  toggleEditPopUp() {
    this.openEditDialog = !this.openEditDialog;
  }

  closeEditPopUp() {
    if (this.openEditDialog) {
      this.openEditDialog = false;
    }
  }

  deleteMessage(aIndex: number) {
    this.openEditDialog = false;
    let number = this.threadC.chNum;
    let i = this.threadC.coIndex;
    let j = this.threadC.thIndex;
    this.deleteFileIfExist(number, i, j, aIndex)
    this.channelList[number].communikation[i].threads[j].answer.splice(aIndex, 1);
    this.chathelper.updateDB(this.channelList[number].channel.idDB, "thread", { "communikation": this.channelList[number].communikation });
  }

  deleteUp(e: any, aIndex: number) {
    e.preventDefault();
    let number = this.threadC.chNum;
    let i = this.threadC.coIndex;
    let j = this.threadC.thIndex;
    let fileTitle = this.getFileTitleIfExist(number, i, j, aIndex);

    if (this.channelList[number].communikation[i].threads[j].answer[aIndex].message != "") {
      this.deleteFileFromStorage(fileTitle);
      this.channelList[number].communikation[i].threads[j].answer[aIndex].url = { "link": "", "title": "" };
    } else {
      this.deleteFileFromStorage(fileTitle);
      this.channelList[number].communikation[i].threads[j].answer[aIndex].url = { "link": "", "title": "" };
      this.deleteMessage(aIndex);
    }
    this.chathelper.updateDB(this.channelList[number].channel.idDB, "thread", { "communikation": this.channelList[number].communikation });
  }

  deleteFileIfExist(number, i, j, aIndex) {
    let fileTitle = this.getFileTitleIfExist(number, i, j, aIndex);
    if (fileTitle) {
      this.deleteFileFromStorage(fileTitle);
    }
  }

  deleteFileFromStorage(fileTitle) {
    this.chathelper.deleteFileFromStorage(fileTitle);
  }

  getFileTitleIfExist(number, i, j, aIndex) {
    if (this.channelList[number].communikation[i].threads[j].answer[aIndex].url.title) {
      return this.channelList[number].communikation[i].threads[j].answer[aIndex].url.title;
    } else { return false };
  }

  noEmoji() {
    if (this.clickInsideEmoji) {
      this.clickInsideEmoji = false;
      return;
    }
    if (this.showEmojisLower)
      this.showEmojisLower = false;
    if (this.showEmojisUpper)
      this.showEmojisUpper = false;
    if (this.showEmojisTA)
      this.showEmojisTA = false;
    if (this.smileEdit)
      this.smileEdit = false;
  }


  clickedInsideEmojiMart() {
    this.clickInsideEmoji = true;
  }
}