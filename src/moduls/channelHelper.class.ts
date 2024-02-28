import { MatDialogRef } from "@angular/material/dialog";
import { ChannelMembersComponent } from "src/app/channel-members/channel-members.component";
import { User } from "./user.class";
import { ChatHepler } from "./chatHelper.class";
import { EditChannelComponent } from "src/app/edit-channel/edit-channel.component";
import { SmileHelper } from "./smileHelper.class";

export class ChannelHelper {

  public dialogPosTop: string = '195px';
  public editChanPosLeft: string = '445px';
  public membersDialogPosRight: string = '110px';
  public addMembersDialogPosRight: string = '60px';
  public chatHelper: ChatHepler = new ChatHepler();
  public dialogEditChanClasses: Array<string> =
    ['dialogBorToLeNone', 'maxWidth100', 'dialogBorRadNone', 'dialogMarginMiddle', 'dialogMarginNone'];

  setEditChanPos(sideMenuHidden: boolean) {
    if (sideMenuHidden) {
      this.editChanPosLeft = '60px';
    } else {
      this.editChanPosLeft = '445px';
    }
  }

  /**
 * Sets the Position of channel-members-dialog and add-people-dialog,
 * depending on whether side-menu-thread(==openChat), is open or closed.
 */
  setPositionOfDialogs(openChat: boolean, mobileScreenWidth: boolean) {
    if (openChat) {
      this.membersDialogPosRight = '615px';
      this.addMembersDialogPosRight = '565px';
    } else {
      this.membersDialogPosRight = '110px';
      this.addMembersDialogPosRight = '60px';
    }
    this.dialogPosTop = '195px';
    this.setPositionOfDialogsMobile(mobileScreenWidth);
  }

  /**
* Sets the Position of channel-members-dialog and add-people-dialog,
* depending on screenWidth.
*/
  setPositionOfDialogsMobile(mobileScreenWidth: boolean) {
    if (mobileScreenWidth) {
      this.membersDialogPosRight = '0px';
      this.addMembersDialogPosRight = '0px';
      this.dialogPosTop = '0px';
    }
  }

  /**
   * Goves the needet variables to the Dialog
   * @param dialogRef MatDialogRef of ChannelMembersComponent
   */
  setChannelMembersValues(dialogRef: MatDialogRef<ChannelMembersComponent, any>, user: User, threadList: any[], number: number, userList: User[]) {
    let instance = dialogRef.componentInstance;
    instance.user = new User(user.toJSON());
    instance.channel = threadList[number].channel;
    instance.userList = userList;
    instance.dialogRef = dialogRef;
  }

  /**
 * 
 * @returns Creates a new Question as JSON
 */
  createMessage(user: User, chathelper: ChatHepler, textThread: string, userList: User[], dataUpload: any) {

    let messageJSON = {
      "name": user.name,
      "iD": user.idDB,
      "edit": false,
      "smile": [],
      "time": chathelper.parseTime(new Date(Date.now())),
      "url": { "link": dataUpload.link, "title": dataUpload.title },
      "message": textThread,
      "messageSplits": chathelper.getLinkedUsers(user, userList, textThread),
      "answer": []
    }
    console.log('textThread=', textThread)
    dataUpload.link = "";
    dataUpload.title = "";
    return messageJSON;
  }

  /**
   * Send the required data up to the dialog where the channel can be edited
   * @param dialogRef   MatDialogRef of the dialog
   * @param threadList  Lists of all Channelkmunikations
   * @param number  Number of thhe channel
   * @param userList 
   * @param user  
   * @returns 
   */
  setValuesToEditDialog(dialogRef: MatDialogRef<EditChannelComponent, any>, threadList: any[], number: number, userList: User[], user: User) {
    dialogRef.componentInstance.channel = threadList[number].channel;
    dialogRef.componentInstance.userList = userList;
    dialogRef.componentInstance.user = user;
    return dialogRef;
  }

  /**
 * Creates the emoji data, that shell be stored.
 */
  createEmojiData(emoji: string, s: any, smileHelper: SmileHelper, user: User) {
    let sm = s;
    let smileIndex = smileHelper.smileInAnswer(emoji, sm);
    if (smileIndex == -1) {
      let icon = {
        "icon": emoji,
        "users": [
          { "id": user.idDB }
        ]
      };
      sm.push(icon);
    } else {
      let usersIcon = sm[smileIndex].users;

      if (!smileHelper.isUserInSmile(usersIcon, user)) {
        sm[smileIndex].users.push({ "id": user.idDB });
      }
    }
    return sm;
  }

  /**
   * Deletes the message
   * @param number  Channelnumber
   * @param i       Communication number
   * @param j       threadnumber
   * @param chatHelper   
   * @param threadList 
   */
  async deleteMessage(number: number, i: number, j: number, threadList: any[]) {

    if (threadList[number].communikation[i].threads.length > 1) {
      this.deleteFileIfExist(i, j, number, threadList);
      threadList[number].communikation[i].threads.splice(j, 1);
    }
    else {
      if (threadList[number].communikation.length > 1) {
        this.deleteFileIfExist(i, j, number, threadList);
        threadList[number].communikation.splice(i, 1);
      }
      else {
        this.deleteFileIfExist(i, j, number, threadList);
        threadList[number].communikation = [{ "date": "", "threads": [] }];
      }
    }

    await this.chatHelper.updateDB(threadList[number].channel.idDB, "thread", { "communikation": threadList[number].communikation });
  }

  /**
   * Deletes the uploaded file 
   * @param number  Channelnumber
   * @param i       Communication number
   * @param j       threadnumber
   * @param chatHelper   
   * @param threadList 
   */
  deleteUp(number: number, i: number, j: number, threadList: any[]) {
    let fileTitle = this.getFileTitleIfExist(i, j, number, threadList);
    if (threadList[number].communikation[i].threads[j].message != "") {
      this.deleteFileFromStorage(fileTitle);
      threadList[number].communikation[i].threads[j].url = { "link": "", "title": "" };
    } else {
      threadList[number].communikation[i].threads[j].url = { "link": "", "title": "" };

      this.deleteFileFromStorage(fileTitle);
      this.deleteMessage(number, i, j, threadList);
    }
    this.chatHelper.updateDB(threadList[number].channel.idDB, "thread", { "communikation": threadList[number].communikation });
  }

  deleteFileIfExist(i, mIndex, number, threadList) {
    let fileTitle = this.getFileTitleIfExist(i, mIndex, number, threadList);
    if (fileTitle) {
      this.deleteFileFromStorage(fileTitle);
    }
  }
  deleteFileFromStorage(fileTitle) {
    this.chatHelper.deleteFileFromStorage(fileTitle);
  }
  getFileTitleIfExist(i, mIndex, number, threadList) {
    if (threadList[number].communikation[i].threads[mIndex].url.title) {
      return threadList[number].communikation[i].threads[mIndex].url.title
    } else { return false }
  }
}