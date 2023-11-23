import { MatDialogRef } from "@angular/material/dialog";
import { ChannelMembersComponent } from "src/app/channel-members/channel-members.component";
import { User } from "./user.class";
import { ChatHepler } from "./chatHelper.class";
import { EditChannelComponent } from "src/app/edit-channel/edit-channel.component";
import { SmileHelper } from "./smileHelper.class";

export class ChannelHelper{

  public dialogPosTop: string = '215px';
  public editChanPosLeft: string = '445px';
  public membersDialogPosRight: string = '110px';
  public addMembersDialogPosRight: string = '60px';

setEditChanPos(sideMenuHidden:boolean) {
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
    setPositionOfDialogs(openChat:boolean,mobileScreenWidth:boolean) {
        if (openChat) {
          this.membersDialogPosRight = '615px';
          this.addMembersDialogPosRight = '565px';
        } else {
          this.membersDialogPosRight = '110px';
          this.addMembersDialogPosRight = '60px';
        }
        this.setPositionOfDialogsMobile(mobileScreenWidth);       
      }

      /**
   * Sets the Position of channel-members-dialog and add-people-dialog,
   * depending on screenWidth.
   */
  setPositionOfDialogsMobile(mobileScreenWidth:boolean) {
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
  setChannelMembersValues(dialogRef: MatDialogRef<ChannelMembersComponent, any>,user:User,threadList:any[],number:number,userList:User[]) {  //---------------------------helper
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
  getQuestion(user:User,chathelper:ChatHepler,textThread:string,userList:User[],dataUpload:any) {
    console.log("dataUpload",dataUpload);
    let question = {
      "name": user.name,
      "iD": user.idDB, //of person that writes the message
      "edit": false,
      "smile": [],
      "time": chathelper.parseTime(new Date(Date.now())),
      "url":{"link":dataUpload.link,"title":dataUpload.title},
      "message":textThread,
      "messageSplits": chathelper.getLinkedUsers(user,userList, textThread),
      "answer": []
    }
    dataUpload.link="";
    dataUpload.title="";
    return question;
  }

  setValuesToEditDialog(dialogRef: MatDialogRef<EditChannelComponent,any>,threadList:any[],number:number,userList:User[],user:User,screenWidth:number){
    dialogRef.componentInstance.channel = threadList[number].channel;//Kopie
    dialogRef.componentInstance.userList = userList;//Kopie
    dialogRef.componentInstance.user = user;//Kopie
    dialogRef.componentInstance.screenWidth = screenWidth;
    console.log("dialogRef",dialogRef);
    return dialogRef;
  }

    /**
   * Creates the emoji data, that shell be stored.
   */
    createEmojiData(emoji: string,s:any,smileHelper:SmileHelper,user:User) {     
       let sm=s;     
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
 
}