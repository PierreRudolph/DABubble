import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-create-account-avatar',
  templateUrl: './create-account-avatar.component.html',
  styleUrls: ['./create-account-avatar.component.scss']
})
export class CreateAccountAvatarComponent {

  @Input() name:string="";

  weiter(){}
}
