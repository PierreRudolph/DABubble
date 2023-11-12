import { Firestore, doc, updateDoc } from "@angular/fire/firestore";
import {  inject } from '@angular/core';

export class ChatHepler{
  public firestore: Firestore= inject(Firestore);

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
                  "icon":"",
                  "users":[
                    {"id":""}
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

      createNewTalk(user:any,otherChatUser:any): {} {
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
                  "icon":"",
                  "users1ID":"",
                  "users2ID":"",                                     
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
          { "creator":"",
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
                      "icon":"",
                      "users":""
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
                          "icon":"",
                          "users":[
                            {"id":""}
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
    

}