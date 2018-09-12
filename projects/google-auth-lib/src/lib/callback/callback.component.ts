import { Component, OnInit, AfterViewInit, Inject, TemplateRef, OnDestroy } from '@angular/core';
import { LoadingViewService } from '../services/loading-view.service';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { IClientConfig } from '../client-config.interface';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-store';
import { map, switchMap, filter, tap, concatMap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Component({
  selector: 'ga-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit, AfterViewInit, OnDestroy {
  redirectAfterLogin: string;
  redirectSubscription: Subscription;
  getCodeSubscription: Subscription;
  loadingTemplate: TemplateRef<any>;
  routeUrlSubscription: Subscription;
  fragmentSubscription: Subscription;

  constructor(
    @Inject('CLIENT_CONFIG') private config: IClientConfig,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingViewService: LoadingViewService,
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient
  ) {
    this.redirectAfterLogin = (config.redirectAfterLogin === undefined) ? '/' : config.redirectAfterLogin;
  }

  ngOnInit() {
    this.loadingTemplate = this.loadingViewService.loadingView;
  }

  ngAfterViewInit() {
    let redirect = `/${this.config.redirectUrl.split('/').pop()}`;
    this.routeUrlSubscription = this.activatedRoute.url.pipe(
      filter((url: UrlSegment[]) => url.length > 0),
      map((url: UrlSegment[]) => `/${url[0].path}` ),
      filter((path: string) => redirect === path),
      switchMap(() => {
        return this.activatedRoute.fragment
      })
    ).pipe(
      switchMap((fragment: string) => {
        let accessToken: string;
        fragment.split('&').forEach((hash) => {
          let keyPair = hash.split('=');
          let key = keyPair[0];
          let value = keyPair[1];
          if(key === "access_token") {
            accessToken = value;
          }
          if(key === "expires_in") {
            let expires = Math.floor(Date.now()) + (+value * 1000);
            this.localStorageService.set('expires', expires);
          }
          this.localStorageService.set(key, value);
        });
        const options = {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
          })
        };
        return this.httpClient.get<User>('https://www.googleapis.com/plus/v1/people/me', options)
      })
    )
    .subscribe((user: User) => {
      this.localStorageService.set('google_user_info', JSON.stringify(user));
      this.router.navigate([this.redirectAfterLogin]);
    });
  }

  ngOnDestroy(): void {
    this.routeUrlSubscription.unsubscribe();
  }

}
