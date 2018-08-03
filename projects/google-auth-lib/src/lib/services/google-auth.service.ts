import { Injectable, NgZone } from '@angular/core';
import { OAuthService, ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
//import { User } from '../models/user.model';
import { StorageBrige } from './storage-bridge.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { LocalStorageService, NgxStorageEvent } from 'ngx-store';
import { Idtoken } from '../models/idtoken';
import { User } from '../models/user';

@Injectable()
export class GoogleAuthService {
  private oauthService: OAuthService;
  private isLoggedInSub = new BehaviorSubject<boolean>(this.storageBrige.getItem('access_token') !== null);

  constructor(
    ngZone: NgZone,
    httpClient: HttpClient,
    private storageBrige: StorageBrige,
    validationHandler: ValidationHandler,
    authConfig: AuthConfig,
    urlHelperService: UrlHelperService,
  ) {
    this.oauthService = new OAuthService(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService);
    this.storageBrige.localStorageService.observe('access_token').pipe(
    ).subscribe(
      (event: NgxStorageEvent) => {
        this.isLoggedInSub.next(true)
      }
    );
  }
  getAccessToken(): string {
    if(this.storageBrige === undefined) {
      let tokenRaw = this.oauthService.getAccessToken();
      if(tokenRaw !== undefined) {
        let token = tokenRaw.replace(/\"/g, '');
        return token;
      }
      return tokenRaw;
    }
    let expires = +this.storageBrige.getItem('expires');
    if (expires !== 0) {
      let now = Math.floor(Date.now());
      if (now > expires) {
        this.logOut();
        this.storageBrige.removeItem('authuser');
        this.storageBrige.removeItem('expires');
        this.storageBrige.removeItem('prompt');
        this.storageBrige.removeItem('state');
        this.storageBrige.removeItem('token_type');
        this.oauthService.initImplicitFlow();
      }
    }
    let tokenRaw = this.oauthService.getAccessToken();
    if(tokenRaw !== undefined) {
      let token = tokenRaw.replace(/\"/g, '');
      return token;
    }
    return tokenRaw;
  }
    getAccessTokenExpiration(): number {
      if(this.storageBrige !== undefined) {
        return +this.storageBrige.getItem('expires');
      }
      return this.oauthService.getAccessTokenExpiration();
    }

  logOut() {
    if(this.storageBrige !== undefined) {
      this.storageBrige.removeItem('authuser');
      this.storageBrige.removeItem('expires');
      this.storageBrige.removeItem('prompt');
      this.storageBrige.removeItem('state');
      this.storageBrige.removeItem('token_type');
    }
    this.oauthService.logOut();
    this.isLoggedInSub.next(false);
  }

  isLoggedInSubject(): BehaviorSubject<boolean> {
    return this.isLoggedInSub;
  }

  startImplicitFlow() {
    this.oauthService.initImplicitFlow();
  }

  getIdTokenClaims(): Idtoken {
    return JSON.parse(atob(this.oauthService.getIdToken().split('.')[1]));
  }

  getUserInfo(): User  {
    return JSON.parse(this.storageBrige.getItem('google_user_info'));
  }
}
