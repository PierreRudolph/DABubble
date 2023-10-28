import { Component } from '@angular/core';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-create-account-main',
  templateUrl: './create-account-main.component.html',
  styleUrls: ['./create-account-main.component.scss']
})
export class CreateAccountMainComponent {

  public fristpage = false;
  public user: User = new User();

  construkter() {
  
  }

  setPage(user: User) {
    console.log("name as string", user.name);
    this.user = user;   
    this.fristpage= false;
  }

}
