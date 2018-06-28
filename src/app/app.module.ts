import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SuccessComponent } from './success/success.component';

import { GoogleAuthLibModule } from 'google-auth-lib';
import { GoogleAuthService } from 'google-auth-lib';
import { OAuthService } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    AppComponent,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleAuthLibModule.withConfig({
      clientId: '',
      redirectUrl: 'http://localhost:4200/authcallback',
      redirectAfterLogin: '/success',
      redirectAfterLogout: '/'
    })
  ],
  providers: [
    {
      provide: GoogleAuthService, 
      useExisting: OAuthService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
