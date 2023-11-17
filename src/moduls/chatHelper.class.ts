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


  // getLinkedUsers(text: string) {
  //   let splittedtText = []
  //   let linkedUserList = [];
  //   let t = text;
  //   let s = "";


  // }

  extraktName(user: User, userList: any[], text: string): any {
    let t = text;
    let index = 0;
    let h = "";
    let len = 0;
    let name = "";
    let last = 0;
    console.log("t ist:", t);
    let infoBack = { "link": "", "rest": "" };

    userList.forEach((u) => {
      name = '@' + u.name;
      len = name.length;
      if (len <= t.length) {
        h = t.substring(0, index + len);
        last = t.charCodeAt(index + len);
        // console.log("h ist ", h);
        // console.log("euql  ", h==name);
        // console.log("name  ",name);
        // console.log("rest  ",t.substring(len));
        // console.log("last ", last)
        if ((h == name) && (last < 65 || last > 122)) {
          console.log("the filtered name is", name);
          infoBack.link = h;
          infoBack.rest = t.substring(len);
        }
      }
    });
    return infoBack;
  }

  splitAtName(user: User, userList: any[], text: string) {
    let t = text;
    let s = "";
    let r = "";
    let i = 0;
    let index = t.indexOf('@');
    let infoList = [];
    let storedInfo = { "before": "", "link": "", };
    let infoBack = { "link": "", "rest": "" };
    while ((index != -1) && (i < 5)) {
      i++;
      s = t.substring(0, index - 1);

      r = t.substring(index);
      console.log("s ", s);
      console.log("r ", r);
      infoBack = this.extraktName(user, userList, r);
      infoList.push(infoBack);
      t = infoBack.rest;
      index = t.indexOf('@');
    }
    console.log("Infolist", infoList);
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
    console.log("helper ", helper);
  }

  getLinkedUsers(user: User, userList: any[], text: string) {  
    let messageInformation=[];
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
    console.log("isPart", isPart);
    this.sortParts(isPart);
    console.log("isPartSorted", isPart);
    isPart.forEach((us) => {
      us.index = us.index - subtrakt;
      s = t.substring(0, us.index);
      end = ('@' + us.name).length + us.index;
      ut = t.substring(us.index, end);
      let rest = t.substring(end);
      console.log("s ", s);
      console.log("ut ", ut);
      console.log("rest ", rest);
      t = rest;
      subtrakt = text.length - rest.length;
      messageInformation.push({"type":"t","text":s});
      messageInformation.push({"type":"l","text":ut});
    });
    if(t.length>0){
      messageInformation.push({"type":"t","text":t});
    }
    console.log(messageInformation);
  }


  isPartOf(name: string, text: string) {
    let part = '@' + name;
    let index = text.indexOf(part);
    let sub = text.substring(index + part.length);
    console.log("sub", sub);
    let ret = -1;
    if (sub.length > 1) {
      let last = sub.charCodeAt(0);
      console.log("last", last);
      if ((last < 65) || (last > 122)) {
        ret = index;
      }
    }
    return text.indexOf(part);
  }


}