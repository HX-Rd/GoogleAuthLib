import { Injectable, NgZone } from '@angular/core';
import { ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { IClientConfig } from '../client-config.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { CallbackComponent } from '../callback/callback.component';
import { StorageBrige } from './storage-bridge.service';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class GoogleAuthInjector {
    private static instance: GoogleAuthService = null;

    // Return the instance of the service
    public static getInstance(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GoogleAuthService {
        if (GoogleAuthInjector.instance === null) {
            router.config.push(
                {
                    path: config.redirectUrl.split('/').pop(),
                    component: CallbackComponent
                }
            );
            router.resetConfig(router.config);

            let scopes = (config.scopes === undefined)
              ? 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
              : config.scopes;
            let authConfig = new AuthConfig();
            authConfig.oidc = true;
            authConfig.scope = scopes;
            authConfig.clientId = config.clientId;
            authConfig.redirectUri = config.redirectUrl;
            authConfig.loginUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
            authConfig.userinfoEndpoint = 'https://www.googleapis.com/plus/v1/people/me';

            GoogleAuthInjector.instance = new GoogleAuthService(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService);

        }
        return GoogleAuthInjector.instance;
    }
}
