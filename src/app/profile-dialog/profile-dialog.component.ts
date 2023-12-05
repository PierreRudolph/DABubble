import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/moduls/user.class';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {
  @Input() user: User = new User();
  @Output() newItemEvent = new EventEmitter<boolean>();
  @Output() newItemEventUser = new EventEmitter<User>();
  public edit: boolean = false;

  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('')
  })
  constructor(public screen: ScreenService) { }

  editData() {
    this.edit = !this.edit;
    setTimeout(() => {
      (document.getElementById("nameEdit") as HTMLInputElement | null).value = this.user.name;
      (document.getElementById("emailEdit") as HTMLInputElement | null).value = this.user.email;
    }, 125);
  }

  addNewItem(open: boolean) {
    this.newItemEvent.emit(open);
  }

  closeDialog() {
    this.addNewItem(false);
  }

  /**
   * Save the given name and email only if they have a valid Fom. Otherwise the previouse values are kept.
   */
  save() {
    let n = this.registerForm.value.name;
    let e = this.registerForm.value.email;
    let validMail = this.registerForm.valid;
    if (n !== "") {
      this.user.name = n;
    }
    if (e !== "" && validMail) {
      this.user.email = e;
    }
    this.newItemEventUser.emit(this.user);
    this.closeDialog();
  }
}
