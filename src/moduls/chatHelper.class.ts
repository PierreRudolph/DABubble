import { Firestore, addDoc, collection, doc, updateDoc } from "@angular/fire/firestore";
import { inject } from '@angular/core';
import { User } from "./user.class";
import { AngularFireStorage } from "@angular/fire/compat/storage";

export class ChatHepler {
  public firestore: Firestore | undefined;
  public fireStorage: AngularFireStorage | undefined;
  public storageList: Array<string> = [];

  constructor() {
    this.firestore = inject(Firestore);
    this.fireStorage = inject(AngularFireStorage);
  }

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
          "url": { "link": "", "title": "" },
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
          "url": { "link": "", "title": "" },
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
      () => {
      }
    ).catch(
      (err) => { console.log(err); });
  }


  createEmptyThread(): any {
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
              "iD": "",
              "edit": false,
              "smile": [
                {
                  "icon": "",
                  "users": ""
                }
              ],
              "time": "",
              "url": { "link": "", "title": "" },
              "message": "",
              "messageSplits": [{ "type": "", "text": "" }],
              "answer": [
                {
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
                  "url": { "link": "", "title": "" },
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

  getMonth(month: number): string {
    switch (month) {
      case 1: return "Januar"; case 2: return "Februar"; case 3: return "März"; case 4: return "April"; case 5: return "Mai";
      case 6: return "Juni"; case 7: return "Juli"; case 8: return "August"; case 9: return "September"; case 10: return "Oktober"; case 11: return "November"; default: return "Dezember"
    }
  }

  parseDate(dt: Date) {
    let day = dt.getDay();
    let dayDate = dt.getDate();
    let month = this.getMonth(dt.getMonth() + 1);
    let year = dt.getFullYear();
    let wochentag = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    return wochentag[day] + ", " + dayDate + " " + month + " " + year;
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
    let uList = [user];
    userList.forEach((ul) => {
      uList.push(ul);
    });
    uList.forEach((u) => {
      go = true;
      while (go) {
        index = this.isPartOf(u.name, text);
        if (index != -1) {
          let i = index + add;
          let elem = {
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
      if (s != '') {
        messageInformation.push({ "type": "t", "text": s });
      }
      if (ut != '') {
        messageInformation.push({ "type": "l", "text": ut });

      }
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

  /**
    * Stores the given User in the Database
    * @param item JSON that contains the userinformations
    */
  async addUser(item: {}) {
    await addDoc(this.userRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            let idDoc = docRef.id;
            this.updateDB(idDoc, "user", { "idDB": idDoc });
          }
        });
  }

  getSingleUserRef(docId: string) {
    return doc(this.firestore, 'user', docId);
  }
  userRef() {
    return collection(this.firestore, 'user');
  }

  /**
   * 
   * @param text Searchtext
   * @param threadList  List that contains the information from all Channels
   * @returns           List of all Channel that contain the text in the name or description
   */
  searchChannelNames(text: string, threadList: any[]) {
    let output = [];
    let searchText = text.toLowerCase();
    let i = -1;
    threadList.forEach((t) => {
      i++;
      if (t.channel.name.toLowerCase().includes(searchText) || t.channel.description.toLowerCase().includes(searchText)) {
        let des = "";
        if (t.channel.description.toLowerCase().includes(searchText)) {
          des = this.makeSubstring(t.channel.description, 20)
        }
        output.push({ "name": t.channel.name, "index": i, "decription": des });
      }
    });
    let threadTitleDec = output;
    return threadTitleDec
  }

  makeSubstring(s: string, len: number) {
    let l = s.length;
    let min = Math.min(l, len);
    let sub = s.substring(0, min);
    return sub;
  }

  /**
   * 
   * @param text Searchtext
   * @param talkList  List of all private talks of the logged in User
   * @returns         List of all private Messages that contain the text
   */
  searchPrivateMess(text: string, talkList: any[]) {
    let output = [];
    let searchText = text.toLowerCase();
    let num = -1;
    let cIndex = -1;
    let mIndex = -1
    talkList.forEach((ch) => {
      num++;
      ch.communikation.forEach((com) => {
        cIndex++;
        com.messages.forEach((mes) => {
          mIndex++;
          if (mes.message.toLowerCase().includes(searchText)) {
            output.push({
              "nameMem1": ch.member1, "nameMem2": ch.member2,
              "member1DBid": ch.member1DBid, "member2DBid": ch.member2DBid,
              "num": num, "cIndex": cIndex,
              "mIndex": mIndex, "message": mes.message, "time": mes.time
            });
          }
        });
        mIndex = -1;
      });
      cIndex = -1;
    });
    let talkMessages = output;
    return talkMessages;
  }

  /**
   * 
   * @param text Searchtext
   * @param threadList  List that contains the information from all Channels
   * @returns           List of all threads that contain the given Text in the Messages
   */
  searchChannelMessages(text: string, threadList: any[]) {
    let output = [];
    let searchText = text.toLowerCase();
    let num = -1;
    let cIndex = -1;
    let tIndex = -1
    threadList.forEach((ch) => {
      num++;
      ch.communikation.forEach((com) => {
        cIndex++;
        com.threads.forEach((th) => {
          tIndex++;
          if (th.message.toLowerCase().includes(searchText)) {
            output.push({ "chanName": ch.channel.name, "num": num, "cIndex": cIndex, "tIndex": tIndex, "name": th.name, "message": th.message, "time": th.time });
          }
        });
        tIndex = -1;

      });
      cIndex = -1;
    });
    let threadMessages = output;
    return threadMessages;
  }

  /**
   * 
   * @param text Searchtext
   * @param userList List of all Users
   * @param user     logged in user
   * @returns        All serch result fom name and email
   */
  searchProfiles(text: string, userList: any[], user: User) {
    let output = [];
    let searchText = text.toLowerCase();
    let i = -1;
    userList.forEach((t) => {
      i++;
      if (t.name.toLowerCase().includes(searchText) || t.email.toLowerCase().includes(searchText)) {
        output.push(t);
      }
    });
    if (user.name.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText)) {
      output.push(user);
    }
    let userInfos = output;
    return userInfos;
  }


  /** 
   * @param message JSON of all infos from the private Message
   * @param userList List of all Users
   * @param user     current User
   * @returns       returns the other user of the private message
   */
  getOtherUser(message: any, userList: any[], user: User) {
    let otherUser = new User();
    let m1 = message.member1DBid;
    let m2 = message.member2DBid;
    if (m1 == m2) { otherUser = user; }
    else {
      userList.forEach((ul) => {
        if ((ul.idDB == m1 && user.idDB == m2) || ul.idDB == m2 && user.idDB == m1) {

          otherUser = ul;
        }
      });
    }
    return otherUser;
  }

  /**
   * 
   * @param user 
   * @param userList 
   * @param id        Id of the User where I wan tto get the name from 
   * @returns  name of the user with the given id
   */
  getUsernameById(user: User, userList: any[], id: string) {
    let name = "";
    userList.forEach((u) => {
      if (u.idDB == id) {
        name = u.name;
      }
    });
    if (user.idDB == id) {
      name = user.name;
    }
    return name;
  }

  /**
* Savesthe filename and filepath of uploaded link in dataUpload
* @param  dataUpload   JSON where the link and filename of the uploaded file is stored
* @param event Uploaded file
*/
  async onSelect(event: any, dataUpload: any) {
    const file = event.target.files[0];
    let nameExist = false;
    await this.subFirestoreStorage();
    this.storageList.forEach((name) => {
      if (file.name == name) {
        nameExist = true;
      }

    })
    let path: string;
    let id: string = this.generateId();
    if (file) {
      path = `yt/${file.name}_${id}`;
      const upoadTask = await this.fireStorage.upload(path, file);
      dataUpload.link = await upoadTask.ref.getDownloadURL();
      dataUpload.title = file.name + '_' + id;
      await this.subFirestoreStorage();
    };
    event = null;
  }

  generateId() {
    let id = this.getRandomInteger().toString();
    for (let i = 0; i < 2; i++) {
      id = id + this.getRandomInteger();
    }
    return `(id:${id})`;
  }

  getRandomInteger() {
    return Math.floor(Math.random() * 9 + 1);
  }

  deleteFileFromStorage(name: string) {
    this.fireStorage.ref('yt/').child(name).delete().subscribe(() => {
      this.subFirestoreStorage();
    });
  }


  async subFirestoreStorage() {
    return this.fireStorage.ref('yt/').listAll().subscribe((data) => {
      this.storageList = [];
      data.items.forEach(item => {
        this.storageList.push(item.name);
      });
    })

  }
}