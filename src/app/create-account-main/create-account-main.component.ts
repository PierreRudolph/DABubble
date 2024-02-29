import { Component } from '@angular/core';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-create-account-main',
  templateUrl: './create-account-main.component.html',
  styleUrls: ['./create-account-main.component.scss']
})
export class CreateAccountMainComponent {
  public firstpage: boolean = true;
  public user: User = new User();


  /**
   * Sets the User and handles what page is active.
   * @param user User that will be created
   */
  setPage(user: User) {
    this.user = user;
    this.firstpage = false;
  }


  goBack(goBackBol: boolean) {
    this.firstpage = goBackBol;
  }
}
