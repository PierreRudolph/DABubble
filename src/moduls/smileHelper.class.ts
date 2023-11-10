import { User } from "./user.class";

export class SmileHelper{
    isUserInSmile(us: any[],user:User) {
        let ret = false;
        us.forEach((u) => {
          if (u.id == user.idDB) {
            ret = true;
          }
        });
    
        return ret;
      }

      removeUser(userL: any[],user:User) {
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
}
