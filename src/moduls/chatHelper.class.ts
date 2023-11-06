export class ChatHepler{

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
              "time": "",
              "message": "",
            }]
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