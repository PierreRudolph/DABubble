import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { CreateAccountComponent } from './create-account/create-account.component';


const routes: Routes = [
  // { path: '', component: MainPageComponent }
  {path: '', component: LoginScreenComponent },
  {path: 'signup', component: CreateAccountComponent },
  // {path: 'imprint', component: ImpressumComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
