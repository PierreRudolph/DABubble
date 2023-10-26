import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService { 
  constructor() { }
  canActivate(currentUser: UserToken, userId: string): boolean {
    console.log("navigation allowed?:" ,false);
    return true;
  }
  canMatch(currentUser: UserToken): boolean {
    return true;
  }
}

@Injectable()
class UserToken {
}


