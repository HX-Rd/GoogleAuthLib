import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { WebStorageModule } from 'ngx-store';
import { LocalStorageService } from 'ngx-store';

import { GoogleAuthFactory } from './factories/injection-factories';

import { IClientConfig } from './client-config.interface';
import { LoginComponent } from './login/login.component';

import { GoogleAuthService } from './services/google-auth.service';
import { CallbackComponent } from './callback/callback.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
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
        LocalStorageService,
        {
          provide: GoogleAuthService,
          deps: [
            'CLIENT_CONFIG',
            Router,
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
