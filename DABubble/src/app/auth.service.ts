import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {  Router,  } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user:any;
  public sub:any;
 constructor(private afAuth: AngularFireAuth, private route:Router) {

  this.sub = afAuth.authState.subscribe(user => {
    this.user = user;
    console.log("subscribed to",this.user);
  });
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
        // Login successful
        // console.log("suggcessful login",res.user ? res.user.uid : "");
        // console.log("suggcessful login",this.user);
        // this.route.navigateByUrl("/user");
      })
      .catch((error) => {
        // An error occurred
      });
  }
}
