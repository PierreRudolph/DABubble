import { Component, Input } from '@angular/core';
import { Channel } from 'src/moduls/channel.class';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-add-people-dialog',
  templateUrl: './add-people-dialog.component.html',
  styleUrls: ['./add-people-dialog.component.scss']
})
export class AddPeopleDialogComponent {
  isChecked: boolean | undefined;
  //membersList: any = ['Elias', 'Brigitte', 'Thorben'];
  searchedMembers: Array<string> = [];
  public user: User = new User();
  public userList = [this.user];
  @Input() channel: Channel = new Channel();
  searchText: any;
  filteredMembers: any;

  setValue() {
    this.isChecked = !this.isChecked;
  }

  // ngOnInit(): void {
  //   this.search();
  // }

  searchKey(data: string) {
    console.log(data)
    setTimeout(() => {
      console.log('userliste is', this.userList)
      console.log(this.channel);
    }, 5000);

    //this.searchText = data;
    //this.search();
  }

  search() {
    this.filteredMembers = this.searchText === "" ? this.userList : this.userList.filter((element) => {
      return element.name.toLowerCase() == this.searchText.toLowerCase();
    });
  }
}
