import { Injectable,inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService { 
  constructor() { }
  canActivate(currentUser: UserToken, userId: string): boolean {
    console.log("navigation allowed?:" ,false);
    return false;
  }
  canMatch(currentUser: UserToken): boolean {
    return true;
  }
}

@Injectable()
class UserToken {
}


