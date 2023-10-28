import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import {AuthGuardService} from './auth-guard.service';
import { ImpressumComponent } from './impressum/impressum.component';
import { CreateAccountMainComponent } from './create-account-main/create-account-main.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetComponent } from './reset/reset.component';


const routes: Routes = [
  // 
  {path: 'main', component: MainPageComponent},
  // {path: '', component: MainPageComponent,canActivate: [AuthGuardService]},
  {path: 'login', component: LoginScreenComponent },
  {path: 'forget', component: ForgotPasswordComponent },
  {path: 'reset', component: ResetComponent },
  {path: '', component: MainPageComponent },
  {path: 'signup', component: CreateAccountMainComponent },// canActivate: [AuthGuardService] canaktivate hier nur zu Testzwecke
  {path: 'imprint', component: ImpressumComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

