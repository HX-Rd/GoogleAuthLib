# GithubAuthLib

Google Authentication library for Angular 6

## What does this library do?
This library is a authentication library for Google signin, and the main objective is to make it as easy as possible. Its built on top of
[angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) and it does all the heavy lifting. This library just fills in some of the variables to use google, as well as overwrite some functions in order to support the non JWT tokens that google uses for access tokens.   
Also, the plugin dynamically creates a route that handles the callbacks from google and parses the token, as well as providing you with a sotre for the tokens.

## What does the library provide
The library provides one module `GoogleAuthLibModule`, that includes on component   
`Login` and one service   
`GoogleAuthService`.   
The login compenent's selector is `ga-login`

## Dependencies
The library has two peer dependencies that you have to install, `"angular-2-local-storage": "^2.0.0"` and `"angular-oauth2-oidc": "^4.0.2"`, to install them simply run these commands at the root of your angular repo.   
   
`npm install angular-2-local-storage`   
`npm install angular-oauth2-oidc`   
   
You should also setup `AppRoutingModule` in your root module since the library uses routing.

## How to use the library
Using the library is quite strait forward. Lets start by looking at how to register the module
```typescript
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
      clientId: 'YOUR-CLIENT-ID',
      redirectUrl: 'http://localhost:4200/authcallback',
      redirectAfterLogin: '/success', // Only example value, SuccessComponent is not included in the library 
      redirectAfterLogout: '/'
    })
  ],
  // This is needed because of some AOT issues
  providers: [
    {
      provide: GithubAuthService, 
      useExisting: OAuthService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
Lets go over the config variables

### clientId
*Required*    
This is your google clientId. You can create an app here [Github Apis](https://developer.github.com/apps/building-github-apps/creating-a-github-app/) and there is a lot of documentation online if you run into trouble.

### redirectUrl
*Required*    
Where your token is redirected from github, you will have to setup this redirect url on your app. You do that under your github account -> go to settings -> go to developer settings -> select your app and setup your callback. This is also where you get your clientId and clientSecret. The base address should be your app host ( localhost:4200 usually when deving ) and the endpoint to where the token is recived. In the example we use `authcallback`, this value does not matter so much sine the library takes care of registering this route for you and hooks upp the `LoginComnent` for you on that route. Just make sure that the route is registered on the github app.

### redirectAfterLogin
*Required*    
Where you want the application to redirect after a successfull login. In the example we are using the value `/success` but you should point it to a route where you want to redirect to. The path value is relative and should start with a forward slash.

### redirectAfterLogout
*Required*      
This is much like the `redirectAfterLogin` only for when we logout.

### scopes
*Optional*   
*Default is an array with one value 'user'*   
This is an array of scopes to request when doing the login. For full list of supported scope values take a look at githubs documentation [Github scopes](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/)

## Seting up the login link
Here is an example on how to setup a navbar with the login link ( we will just use app.component here in this example )
`app.component.html`
```html
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <label class="navbar-brand">GoogleTest</label>
    </div>
    <div class="navbar-collapse">
      <ul class="nav navbar-nav">
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <!--TheLogin link is here-->
        <li ga-login></li>
      </ul>
    </div>
  </div>
</nav>
<router-outlet></router-outlet>
```
And that is really all you need.

## Using the GithubAuthService
The GithubAuthService extends OAuthService from the [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) and you should be able to use all the features it provides. I have overwritten some of them to support the non JWT format ( getting the expiery time for examle ) and I havent tested if all of the functions work propery. If there are functions not working as they should, just create an issue. You can see the implementation of the service here [angular-oauth2-oidc OAuthService](https://github.com/manfredsteyer/angular-oauth2-oidc/blob/master/projects/lib/src/oauth-service.ts) for more details, but lets take one example, proparbly the only thing you need from the service anyway, getting the access token.   
Here is an example on how to get the access token inside a component for example.

```typescript
import { Component, OnInit } from '@angular/core';
import { GithubAuthService } from 'github-auth-lib';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(
    private githubService: GithubAuthService
  ) { }

  ngOnInit() {
    let token = this.githubService.getAccessToken();
  }
}
```
