import { Component } from '@angular/core';

@Component({
  selector: 'app-create-account-main',
  templateUrl: './create-account-main.component.html',
  styleUrls: ['./create-account-main.component.scss']
})
export class CreateAccountMainComponent {

  public fristpage = true;
  public user :any;

  setPage(js: string) {
    console.log("name as string", js);
    let data = JSON.parse(js);
    this.user = data;
    console.log("name is", data.name);
    this.fristpage = false;
  }

}
