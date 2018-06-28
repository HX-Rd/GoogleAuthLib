import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core'

import { OAuthService } from "angular-oauth2-oidc";
import { LocalStorageService } from 'angular-2-local-storage';

import { IClientConfig } from '../client-config.interface';

@Component({
  selector: '[ga-login]',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  redirectAfterLogin: string;
  redirectAfterLogout: string;
  isLoggedIn: boolean;
  accessTokenSubject: BehaviorSubject<boolean>;
  codeRedirectUrl: string;

  constructor(
    @Inject('CLIENT_CONFIG') private config: IClientConfig,
    private oauthService: OAuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.redirectAfterLogin = (config.redirectAfterLogin === undefined) ? '/' : config.redirectAfterLogin;
    this.redirectAfterLogout = config.redirectAfterLogout;

    //this.codeRedirectUrl = config.codeRedirectUrl;
  }

  ngOnInit() {
    this.accessTokenSubject = new BehaviorSubject<boolean>(this.localStorageService.get('access_token') !== null);
    this.localStorageService.setItems$.pipe(filter((e) =>
      e.key === 'access_token'
    )).subscribe(() => this.accessTokenSubject.next(true));
    this.localStorageService.setItems$.subscribe(() => this.accessTokenSubject.next(true));
  }

  ngAfterViewInit() {
    this.accessTokenSubject.subscribe((v) => {
        this.isLoggedIn = v;
        this.changeDetectorRef.detectChanges();
    });
    let redirect = `/${this.config.redirectUrl.split('/').pop()}`;
    if (this.router.routerState.snapshot.url.startsWith(redirect) && this.router.routerState.snapshot.root.fragment !== "") {
      this.router.routerState.snapshot.root.fragment.split('&').forEach((hash) => {
        let keyPair = hash.split('=');
        let key = keyPair[0];
        let value = keyPair[1];
        if(key === "expires_in") {
          let expires = Math.floor(Date.now() / 1000) + value;
          this.localStorageService.set('expires', expires);
        } else {
          this.localStorageService.set(key, value);
        }
      })
      this.router.navigate([this.redirectAfterLogin]);
    }
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.isLoggedIn = false;
    if (this.redirectAfterLogout) {
      this.router.navigate([this.redirectAfterLogout]);
    }
  }
}

