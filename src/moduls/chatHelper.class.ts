import { Firestore, doc, updateDoc } from "@angular/fire/firestore";
import { inject } from '@angular/core';
import { User } from "./user.class";

export class ChatHepler {
  public firestore: Firestore = inject(Firestore);

  createEmptyTalk(): {} {
    let t = {
      "member1": "",
      "member1DBid": "",
      "member2": "",
      "member2DBid": "",
      "idDB": "",
      "communikation": [{
        "date": "",
        "messages": [{
          "name": "",
          "iD": "",
          "edit": false,
          "smile": [
            {
              "icon": "",
              "users": [
                { "id": "" }
              ]
            }
          ],
          "time": "",
          "message": "",
          "messageSplits": [{ "type": "", "text": "" }],
        }]
      }]
    }
    return t;
  }

  createNewTalk(user: any, otherChatUser: any): {} {
    let t = {
      "member1": user.name,
      "member1DBid": user.idDB,
      "member2": otherChatUser.name,
      "member2DBid": otherChatUser.idDB,
      "idDB": "",
      "communikation": [{
        "date": this.parseDate(new Date(Date.now())),
        "messages": [{
          "name": "",
          "iD": "",
          "edit": false,
          "smile": [
            {
              "icon": "",
              "users1ID": "",
              "users2ID": "",
            }
          ],
          "time": "",
          "message": "",
          "messageSplits": [{ "type": "t", "text": "" }],
        }]
      }]
    }
    return t;
  }

  async updateDB(id: string, coll: string, info: {}) {

    let docRef = doc(this.firestore, coll, id);
    await updateDoc(docRef, info).then(
      () => { console.log("update", id); }
    ).catch(
      (err) => { console.log(err); });
  }


  createEmptyThread(): any {
    console.log("call new Thread");
    let t = {
      "channel":
      {
        "creator": "",
        "name": "",
        "idDB": "",
        "description": "",
        "members": [{
          "memberName": "",
          "memberID": "",
        }]
      },
      "communikation": [
        {
          "date": "",
          "threads": [
            {
              "name": "",
              "iD": "", //of person that writes the message
              "edit": false,
              "smile": [
                {
                  "icon": "",
                  "users": ""
                }
              ],
              "time": "",
              "message": "",
              "messageSplits": [{ "type": "", "text": "" }],
              "answer": [
                {
                  "name": "",
                  "iD": "", //of person that writes the message
                  "edit": false,
                  "smile": [
                    {
                      "icon": "",
                      "users": [
                        { "id": "" }
                      ]
                    }
                  ],
                  "time": "",
                  "message": "",
                  "messageSplits": [{ "type": "", "text": "" }],
                }
              ]
            }
          ]
        }]
    }
    return t;
  }



  parseTime(dt: Date) {
    let min = dt.getMinutes();
    let hour = dt.getHours();
    return hour + ":" + min;
  }

  parseDate(dt: Date) {
    let day = dt.getDate();
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();

    return day + "." + month + "." + year;
  }

  /**
   * Sort the given List by index.
   * 
   * @param list List in form of {"name":n,"index":i}
   * @returns 
   */
  sortParts(list: any[]) {
    let helper = list;
    helper.sort(function (x, y) {
      if (x.index < y.index) {
        return -1;
      }
      if (x.index > y.index) {
        return 1;
      }
      return 0;
    });
    return helper;
  }

  /**   * 
   * @param user User
   * @param userList This of Users
   * @param t        Text that sould be stored
   * @returns        List of type {"name": u.name,"index": index,} that stores every occurence the form @ username of a user 
   */
  pushLinkedUsers(user: User, userList: any[], t: string) {
    let index = 0;
    let go = true;
    let isPartList = [];   
    let text = t;
    let add = 0;
    let uList =[user];
    userList.forEach((ul)=>{
      uList.push(ul);
    });   
    uList.forEach((u) => {
      go = true;
      while (go) {
        index = this.isPartOf(u.name, text);
        if (index != -1) {         
          let i = index + add;
          let elem={
            "name": u.name,
            "index": i,
          }        
          isPartList.push(elem);         
          text = text.substring(index + 1 + u.name.length);
          add = t.length - text.length;         
        } else {
          go = false;
          text = t;        
          add = 0;
        }
      }
    });    
    return isPartList;
  }
 
  /**
   * 
   * @param user User
   * @param userList This of Users
   * @param text     Text that sould be stored
   * @returns        Gives back alist of type { "type": "", "text": "" }. Stores type l for the q name part and type t for the other parts
   */
  getLinkedUsers(user: User, userList: any[], text: string) {
    let messageInformation = [];
    let t = text;
    let s = "";
    let ut = "";
    let end = 0;
    let isPart = [];
    let subtrakt = 0;

    isPart = this.pushLinkedUsers(user, userList, t);
    isPart = this.sortParts(isPart);
    isPart.forEach((us) => {
      us.index = us.index - subtrakt;
      s = t.substring(0, us.index);
      end = ('@' + us.name).length + us.index;
      ut = t.substring(us.index, end);
      let rest = t.substring(end);
      t = rest;
      subtrakt = text.length - rest.length;
      messageInformation.push({ "type": "t", "text": s });
      messageInformation.push({ "type": "l", "text": ut });
    });
    if (t.length > 0) {
      messageInformation.push({ "type": "t", "text": t });
    }
    return messageInformation;
  }

  /** gibes back wheather element is type link(contains @ name) */
  isLink(type: any) {
    return type.type == 'l';
  }

  /**
   * 
   * @param name name of the user
   * @param text Text we want to store
   * @returns  gives back if @ name (without space but it is needed here in coments) is part of the text as a whole word.
   */
  isPartOf(name: string, text: string) {
    let part = '@' + name;
    let index = text.indexOf(part);  
    let sub = text.substring(index + part.length);   
    let ret = -1;
    if ((sub.length > 0) && (index != -1)) {
      let last = sub.charCodeAt(0);    
      if ((last < 65) || (last > 122)) {
        ret = index;
      }
    } else {
      if (index != -1) {
        ret = index;
      }
    }
    return ret;
  }
}