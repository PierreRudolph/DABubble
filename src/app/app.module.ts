import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HeaderComponent } from './header/header.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ImpressumComponent } from './impressum/impressum.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AuthGuardService } from './auth-guard.service';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { CreateAccountMainComponent } from './create-account-main/create-account-main.component';
import { CreateAccountAvatarComponent } from './create-account-avatar/create-account-avatar.component';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    LoginScreenComponent,
    ImpressumComponent, CreateAccountComponent, SideMenuComponent, CreateAccountMainComponent, CreateAccountAvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatSidenavModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
