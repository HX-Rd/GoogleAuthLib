import { LoginComponent } from './login/login.component';
import { Inject, Injectable, NgZone } from '@angular/core';
import { OAuthService, ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { LocalStorageService } from 'angular-2-local-storage';
import { IClientConfig } from './client-config.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';

@Injectable()
export class StorageBrige implements Storage {
    length: number;
    constructor(private localStorageService: LocalStorageService) {
        this.length = localStorageService.length();
    }
    clear(): void {
        this.length = this.localStorageService.length();
        this.localStorageService.clearAll();
    }
    getItem(key: string): string | null {
        let ret = this.localStorageService.get(key);
        if (typeof ret === 'string') {
            return ret;
        }
        return null;
    }
    key(index: number): string | null {
        return this.localStorageService.keys()[index];
    }
    removeItem(key: string): void {
        this.length = this.localStorageService.length();
        this.localStorageService.remove(key);
    }
    setItem(key: string, data: string): void {
        this.length = this.localStorageService.length();
        this.localStorageService.set(key, data);
    }
    [key: string]: any;
    [index: number]: string;
}

@Injectable()
export class LocalStorageBrigeInjector {
    private static instance: StorageBrige = null;

    // Return the instance of the service
    public static getInstance(localStorageService: LocalStorageService): StorageBrige {
        if (LocalStorageBrigeInjector.instance === null) {
            LocalStorageBrigeInjector.instance = new StorageBrige(localStorageService);
        }
        return LocalStorageBrigeInjector.instance;
    }

    constructor(
        private localStorageService: LocalStorageService,
    ) { }
}

@Injectable()
export class OAuthInjector {
    private static instance: GoogleAuthService = null;

    // Return the instance of the service
    public static getInstance(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GoogleAuthService {
        if (OAuthInjector.instance === null) {
            router.config.push(
                {
                    path: config.redirectUrl.split('/').pop(),
                    component: LoginComponent
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

            OAuthInjector.instance = new GoogleAuthService(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService);

        }
        return OAuthInjector.instance;
    }
}

@Injectable()
export class GoogleAuthService extends OAuthService {
    constructor(
        ngZone: NgZone,
        httpClient: HttpClient,
        private storageBrige: StorageBrige,
        validationHandler: ValidationHandler,
        authConfig: AuthConfig,
        urlHelperService: UrlHelperService
    ) {
        super(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService)
    }
    getAccessToken(): string {
        if(this.storageBrige === undefined) {
            let tokenRaw = super.getAccessToken();
            if(tokenRaw !== undefined) {
                let token = tokenRaw.replace(/\"/g, '');
                return token;
            }
            return tokenRaw;
        }
        let expires = +this.storageBrige.getItem('expires');
        let now = Math.floor(Date.now() / 1000);
        if (now > expires) {
            this.logOut();
            this.storageBrige.removeItem('authuser');
            this.storageBrige.removeItem('expires');
            this.storageBrige.removeItem('prompt');
            this.storageBrige.removeItem('state');
            this.storageBrige.removeItem('token_type');
        }
        let tokenRaw = super.getAccessToken();
        if(tokenRaw !== undefined) {
            let token = tokenRaw.replace(/\"/g, '');
            return token;
        }
        return tokenRaw;
    }

    logOut() {
        if(this.storageBrige !== undefined) {
            this.storageBrige.removeItem('authuser');
            this.storageBrige.removeItem('expires');
            this.storageBrige.removeItem('prompt');
            this.storageBrige.removeItem('state');
            this.storageBrige.removeItem('token_type');
        }
        super.logOut();
    }
}

export function OAuthFactory(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GoogleAuthService {
    return OAuthInjector.getInstance(config, router, ngZone, httpClient, storageBrige, validationHandler, urlHelperService);
}

export function StorageBrigeFactory(localStorageService: LocalStorageService): StorageBrige {
    return LocalStorageBrigeInjector.getInstance(localStorageService);
}