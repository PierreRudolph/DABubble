import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user:any;
  public sub:any;
 constructor(private afAuth: AngularFireAuth) {

  this.sub = afAuth.authState.subscribe(user => {
    this.user = user;
    console.log("subscribed to",this.user);
  });
  }

  getAuth(){
    return this.afAuth;
  }

 async signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("suggcessful register",this.user);

      })
      .catch((error) => {
        console.log("register fail");
      });
  }

  getAuthServiceUser(){
    return this.user;
  }

  async logIn(email: string, password: string) {
   return  this.afAuth.signInWithEmailAndPassword(email, password)
      .then((res) => {       
      })
      .catch((error) => {
        // An error occurred
      });
  }

  logout() {
    this.afAuth.signOut()
      .then(() => {
     console.log("logged out");
      })
      .catch((error) => {
        // An error occurred
      });
  }
 
  async logInWithGoogle(){
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  async forgotPassword(mail:string){
    return this.afAuth.sendPasswordResetEmail(mail);
  }

  

}
