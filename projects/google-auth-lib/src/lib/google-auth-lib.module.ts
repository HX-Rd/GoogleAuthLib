import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

import { WebStorageModule } from 'ngx-store';
import { LocalStorageService } from 'ngx-store';

import { OAuthModule } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';
import { ValidationHandler } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { UrlHelperService } from 'angular-oauth2-oidc';

import { GoogleAuthFactory } from './factories/injection-factories';
import { StorageBrigeFactory } from './factories/injection-factories';
import { StorageBrige } from './services/storage-bridge.service';

import { IClientConfig } from './client-config.interface';
import { LoginComponent } from './login/login.component';

import { GoogleAuthService } from './services/google-auth.service';
import { CallbackComponent } from './callback/callback.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule,
    WebStorageModule
  ],
  declarations: [
    LoginComponent,
    CallbackComponent
  ],
  entryComponents: [
    LoginComponent,
    CallbackComponent
  ],
  exports: [
    LoginComponent,
  ]
})
export class GoogleAuthLibModule {
  static withConfig(clientConfig: IClientConfig): ModuleWithProviders {
    return {
      ngModule: GoogleAuthLibModule,
      providers: [
        { provide: 'CLIENT_CONFIG', useValue: clientConfig},
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        LocalStorageService,
        UrlHelperService,
        {
          provide: StorageBrige,
          deps: [
            LocalStorageService
          ],
          useFactory: StorageBrigeFactory,
          multi: false
        },
        {
          provide: GoogleAuthService,
          deps: [
            'CLIENT_CONFIG',
            Router,
            NgZone,
            HttpClient,
            StorageBrige,
            ValidationHandler,
            UrlHelperService,
            LocalStorageService
          ],
          useFactory: GoogleAuthFactory,
          multi: false
        },
      ]
    };
  }
}

export { IClientConfig } from './client-config.interface';
export { GoogleAuthService } from './services/google-auth.service';
export { LoginComponent } from './login/login.component';
