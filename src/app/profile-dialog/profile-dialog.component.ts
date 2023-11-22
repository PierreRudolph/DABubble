import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {
  @Input() screenWidth: number;
  @Input() user: User = new User();
  @Output() newItemEvent = new EventEmitter<boolean>();
  @Output() newItemEventUser = new EventEmitter<User>();
  public edit: boolean = false;

  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('')
  })
  constructor() { }

  editData() {
    this.edit = !this.edit;
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
    console.log("user", this.user);
    this.newItemEventUser.emit(this.user);
    this.closeDialog();
  }

  mobileScreenWidth() {
    return this.screenWidth < 830;
  }
}
