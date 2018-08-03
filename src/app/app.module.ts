import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SuccessComponent } from './success/success.component';

import { GoogleAuthLibModule } from 'google-auth-lib';
import { GoogleAuthService } from 'google-auth-lib';

@NgModule({
  declarations: [
    AppComponent,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleAuthLibModule.withConfig({
      clientId: '458297116178-ek6i99fmr6mg3hfbobnm1o1fb57lhjgn.apps.googleusercontent.com',
      redirectUrl: 'http://localhost:4200/authcallback',
      redirectAfterLogin: '/success',
      redirectAfterLogout: '/'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
