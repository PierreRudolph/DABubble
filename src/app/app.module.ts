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
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetComponent } from './reset/reset.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { SideMenuThreadComponent } from './side-menu-thread/side-menu-thread.component';
import { MainDialogProfilComponent } from './main-dialog-profil/main-dialog-profil.component';
import { CreateChannelDialogComponent } from './create-channel-dialog/create-channel-dialog.component';
import { AddPeopleDialogComponent } from './add-people-dialog/add-people-dialog.component';
import { PrivateMessageComponent } from './private-message/private-message.component';
import { ThreadBasedChatComponent } from './thread-based-chat/thread-based-chat.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ChannelWindowComponent } from './channel-window/channel-window.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { ChannelMembersComponent } from './channel-members/channel-members.component';
@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    LoginScreenComponent,
    ImpressumComponent,
    CreateAccountComponent,
    SideMenuComponent,
    CreateAccountMainComponent,
    CreateAccountAvatarComponent,
    ForgotPasswordComponent,
    ResetComponent,
    ProfileDialogComponent,
    SideMenuThreadComponent,
    MainDialogProfilComponent,
    CreateChannelDialogComponent,
    AddPeopleDialogComponent,
    PrivateMessageComponent,
    ThreadBasedChatComponent,
    ChannelWindowComponent,
    EditChannelComponent,
    ChannelMembersComponent
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
    MatSidenavModule,
    MatExpansionModule,
    MatDialogModule,
    PickerComponent
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
