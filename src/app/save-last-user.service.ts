import { Injectable } from '@angular/core';
import { User } from 'src/moduls/user.class';

@Injectable({
  providedIn: 'root'
})
export class SaveLastUserService {
 public lastUser:User = new User()
  constructor() { }
}
