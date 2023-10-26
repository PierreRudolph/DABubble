import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImpressumComponent } from './impressum/impressum.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const routes: Routes = [
  {path: '', component: LoginScreenComponent },
  {path: 'signup', component: CreateAccountComponent },
  {path: 'imprint', component: ImpressumComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
