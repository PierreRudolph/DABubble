import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import {AuthGuardService} from './auth-guard.service';


const routes: Routes = [
  {path: 'main', component: MainPageComponent,canActivate: [AuthGuardService]},
  {path: 'login', component: LoginScreenComponent },
  {path: '', component: LoginScreenComponent },
  {path: 'signup', component: CreateAccountComponent },
  // {path: 'imprint', component: ImpressumComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

