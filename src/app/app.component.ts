import { Component, HostListener, inject } from '@angular/core';
import { ScreenService } from './screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DABubble';

  constructor(private screen: ScreenService) {
    this.screen.screenWidth = window.innerWidth;   
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screen.screenWidth = window.innerWidth;
    console.log(this.screen.screenWidth)
  }

}
