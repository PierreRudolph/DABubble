import { ChatHepler } from "./chatHelper.class";
import { User } from "./user.class";

export class SmileHelper {

  private chathelper = new ChatHepler()
  isUserInSmile(us: any[], user: User) {
    let ret = false;
    us.forEach((u) => {
      if (u && user) {//if abfrage fürs testing
        if (u.id == user.idDB) {
          ret = true;
        }
      }
    });

    return ret;
  }

  removeUser(userL: any[], user: User) {
    let uList: any[] = []
    userL.forEach((ul) => {
      if (ul.id != user.idDB) {
        uList.push(ul);
      }
    });
    return uList;
  }

  /**
   * 
   * @param emoji {}  is the given emoji in the iconarray
   * @param sm    JSON Array of the smile {"icon"}
   * @returns    -1 it is not in there or index
   */
  smileInAnswer(emoji: any, sm: any[]) {
    let b = -1;
    let i = -1;
    sm.forEach((s) => {
      i++;
      if (s.icon == emoji) {
        b = i;
      }
    });
    return b;
  }

  showPopUpCommentUsers(smileUsers: any[], user: User, userList: any[]) {
    let back = { "du": "", "first": "", "other": "", "verb": "hast" };
    let a = 0;

    let ind = smileUsers.indexOf(user.idDB);
    if (ind != -1) {
      back.du = "Du";
      a++;
      smileUsers.splice(ind, 1);
    }
    if (smileUsers.length > 0) {
      if (a == 1) { back.verb = "haben"; back.du = "Du und"; } else { back.verb = "hat"; }
      back.first = this.chathelper.getUsernameById(user, userList, smileUsers[0]);
    }
    if (smileUsers.length > 1) {
      back.other = " und andere";
      back.verb = "haben";
    }
    return back;
  }



}
