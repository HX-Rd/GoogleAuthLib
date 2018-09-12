import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService, NgxStorageEvent } from 'ngx-store';
import { Idtoken } from '../models/idtoken';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { IClientConfig } from '../client-config.interface';

@Injectable()
export class GoogleAuthService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(this.storage.get('access_token') !== null);
  public accessTokenSubject = new BehaviorSubject<string>(this.storage.get('access_token'));
  public userInfoSubject = new BehaviorSubject<User>( this.storage.get('google_user_info') === null ? null : JSON.parse(this.storage.get('google_user_info')));

  constructor(
    @Inject('CLIENT_CONFIG') private config: IClientConfig,
    private router: Router,
    private storage: LocalStorageService,
  ) {
    this.storage.observe('access_token').pipe(
    ).subscribe(
      (event: NgxStorageEvent) => {
        this.isLoggedInSubject.next(true)
      }
    );
  }
  getAccessToken(): string {
    let expires = +this.storage.get('expires');
    if (expires) {
      let now = Math.floor(Date.now());
      if (now > expires) {
        this.logOut();
        throw new Error('Access token expired');
      }
    }
    let access_token = this.storage.get('access_token');
    if (access_token) {
      return access_token;
    }
    throw new Error('User is not logged in');
  }
    getAccessTokenExpiration(): number {
      return +this.storage.get('expires');
    }

  logOut() {
    this.cleanupStorage();
    this.isLoggedInSubject.next(false);
    if (this.config.redirectAfterLogout) {
      this.router.navigate([this.config.redirectAfterLogout]);
    }
  }

  login() {
    let scopes = '';
    if (!this.config.scopes) {
      scopes = 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile';
    }
    else {
      scopes = this.config.scopes.join('%20');
    }
    let url = `https://accounts.google.com/o/oauth2/v2/auth`
    + `?response_type=id_token%20token`
    + `&client_id=${this.config.clientId}`
    + `&state=${this.generateRandomString(40)}`
    + `&redirect_uri=${this.config.redirectUrl}`
    + `&scope=${scopes}`
    + `&nonce=${this.generateRandomString(40)}`;
    window.open(url, '_self')
  }

  getIdTokenClaims(): Idtoken {
    return JSON.parse(atob(this.storage.get('id_token').split('.')[1]));
  }

  getUserInfo(): User  {
    return JSON.parse(this.storage.get('google_user_info'));
  }

  private generateRandomString(length: number) : string {
    return Array.from(Array(length).keys()).map(() => { return (~~(Math.random()*36)).toString(36) }).join('');
  }

  private cleanupStorage() {
    this.storage.remove('authuser');
    this.storage.remove('expires');
    this.storage.remove('prompt');
    this.storage.remove('state');
    this.storage.remove('token_type');
    this.storage.remove('expires_in');
    this.storage.remove('nonce');
    this.storage.remove('access_token');
    this.storage.remove('google_user_info');
    this.storage.remove('session_state');
    this.storage.remove('id_token');
  }
}
