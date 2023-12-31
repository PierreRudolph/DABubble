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
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  getAuthServiceUser() {
    return this.user;
  }

  async logIn(email: string, password: string) {
    let ret = this.afAuth.signInWithEmailAndPassword(email, password);

    return ret;
  }

  logout() {
    return this.afAuth.signOut();
  }

  async logInWithGoogle() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  async forgotPassword(mail: string) {
    return this.afAuth.sendPasswordResetEmail(mail);
  }



}
