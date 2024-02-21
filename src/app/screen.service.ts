import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ScreenService {
  public screenWidth: number;

  mobileScreenWidth() {
    return this.screenWidth <= 830;
  }

  screenWidth1050() {
    return this.screenWidth <= 1050;
  }

  screenWidth1540() {
    return this.screenWidth <= 1540;
  }

  callResize() {
    return this.screenWidth;
  }
}
