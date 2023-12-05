import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  screenWidth;

  constructor() { }
  handleScreenResize() {

  }

  mobileScreenWidth() {
    return this.screenWidth < 830;
  }
}
