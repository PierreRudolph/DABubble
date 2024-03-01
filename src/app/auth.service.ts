import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;
  public sub: any;

  constructor(private afAuth: AngularFireAuth) {
    this.sub = afAuth.authState.subscribe(user => {
      this.user = user;

    });
  }


  getAuth() {
    return this.afAuth;
  }


  async signUp(email: string, password: string) {
    let dat = await this.afAuth.createUserWithEmailAndPassword(email, password);
    this.user = dat.user;
    return dat;
  }


  getAuthServiceUser() {
    return this.user;
  }


  async logIn(email: string, password: string) {
    let ret = await this.afAuth.signInWithEmailAndPassword(email, password)
    this.user = ret.user
    return ret;
  }


  logout() {
    return this.afAuth.signOut();
  }


  async logInWithGoogle() {
    let dat = await this.afAuth.signInWithPopup(new GoogleAuthProvider())
    this.user = dat.user;
    return dat;
  }


  async forgotPassword(mail: string) {
    return this.afAuth.sendPasswordResetEmail(mail);
  }
}
