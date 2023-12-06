import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  screenWidth;

  mobileScreenWidth() {
    return this.screenWidth <= 830;
  }
}
