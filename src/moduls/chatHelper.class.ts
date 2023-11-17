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
    // console.log("helper ", helper);
    return helper;
  }

  getLinkedUsers(user: User, userList: any[], text: string) {
    let messageInformation = [];
    let t = text;
    let index = 0;
    let s = "";
    let ut = "";
    let end = 0;
    let isPart = [];
    let subtrakt = 0;
    userList.forEach((u) => {
      index = this.isPartOf(u.name, t);
      if (index != -1) {
        isPart.push({
          "name": u.name,
          "index": index,
        })
      }
    });

    index = this.isPartOf(user.name, t);
    if (index != -1) {
      isPart.push({
        "name": user.name,
        "index": index,
      })
    }
    // console.log("isPart", isPart);
    isPart = this.sortParts(isPart);
    // console.log("isPartSorted", isPart);
    isPart.forEach((us) => {
      us.index = us.index - subtrakt;
      s = t.substring(0, us.index);
      end = ('@' + us.name).length + us.index;
      ut = t.substring(us.index, end);
      let rest = t.substring(end);
      // console.log("s ", s);
      // console.log("ut ", ut);
      // console.log("rest ", rest);
      t = rest;
      subtrakt = text.length - rest.length;
      messageInformation.push({ "type": "t", "text": s });
      messageInformation.push({ "type": "l", "text": ut });
    });
    if (t.length > 0) {
      messageInformation.push({ "type": "t", "text": t });
    }
    console.log(messageInformation);
    return messageInformation;
  }

  isLink(type:any){
      return type.type=='l';
  }


  isPartOf(name: string, text: string) {
    let part = '@' + name;
    let index = text.indexOf(part);
    let sub = text.substring(index + part.length);
    // console.log("sub", sub);
    let ret = -1;
    if (sub.length > 1) {
      let last = sub.charCodeAt(0);
      // console.log("last", last);
      if ((last < 65) || (last > 122)) {
        ret = index;
      }
    }
    return text.indexOf(part);
  }


}