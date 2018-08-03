# GoogleAuthLib

Google Authentication library for Angular 6

## What does this library do?
This library is a authentication library for Google signin, and the main objective is to make it as easy as possible. Its built on top of
[angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc) and it does all the heavy lifting. This library just fills in some of the variables to use google, as well as overwrite some functions in order to support the non JWT tokens that google uses for access tokens.   
Also, the plugin dynamically creates a route that handles the callbacks from google and parses the token, as well as providing you with a sotre for the tokens.

## What does the library provide
The library provides one module `GoogleAuthLibModule`, that includes on component   
`Login` and one service   
`GoogleAuthService`.   
The login compenent's selector is an attribute selector and is `[ga-login]`

## Dependencies
The library has two peer dependencies that you have to install, `"ngx-store": "^2.0.0"` and `"angular-oauth2-oidc": "^4.0.2"`, to install them simply run these commands at the root of your angular repo.   
   
`npm install ngx-store`   
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
Lets go over the config variables

### clientId
*Required*    
This is your google clientId. You can create an app here [Google console](https://console.developers.google.com/) and there is a lot of documentation online if you run into trouble.

### redirectUrl
*Required*    
Where your token is redirected from google, you will have to setup this redirect url on your app. [Google console](https://console.developers.google.com/) -> Select your app -> go to Credentials -> Create a OAuth client ID -> Select a Web applicaiton. This is where you assign your callback in the Authorized redirect URIs. The base address should be your app host ( localhost:4200 usually when deving ) and the endpoint to where the token is recived. In the example we use `authcallback`, this value does not matter so much sine the library takes care of registering this route for you and hooks upp the `LoginComnent` for you on that route. Just make sure that the route is registered on the github app. So for the example we used above the value would be `http://localhost:4200/authcallback`

### redirectAfterLogin
*Required*    
Where you want the application to redirect after a successfull login. In the example we are using the value `/success` but you should point it to a route where you want to redirect to. The path value is relative and should start with a forward slash.

### redirectAfterLogout
*Required*      
This is much like the `redirectAfterLogin` only for when we logout.

### scopes
*Optional*   
*Default is an array with these values 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'*   
This is an array of scopes to request when doing the login. For full list of supported scope values take a look at githubs documentation [Github scopes](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/)

## Using the login component
Here is an example on how to setup a navbar with the login link ( we will just use app.component here in this example )
`app.component.html`
```html
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <label class="navbar-brand">GithubTest</label>
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
And that is really all you need, but you can provide your own templates if you want. You do it like so
`app.component.html`
```html
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <label class="navbar-brand">GithubTest</label>
    </div>
    <div class="navbar-collapse">
      <ul class="nav navbar-nav">
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <!--TheLogin link is here-->
        <li ga-login>
          <ng-template #login>
            <a>Log Me In</a>
          </ng-template>
          <ng-template #logout>
            <a>Log Me Out</a>
          </ng-template>
          <ng-template #loading><div class="loading">Loading...</div></ng-template>
        </li>
      </ul>
    </div>
  </div>
</nav>
<router-outlet></router-outlet>
```
The default templates are just a link with login and logout as text, and nothing for the loading. But if you want you can style it your self by appling your own templates. NOTE, the `loading` css class in the template is not needed, just a demonstration on how you could style it your self.

### GoogleAuthService
#### getAccessToken(): string
Get the access token for the logged in user
#### getUserInfo(): User
Gets the user info for the logged in user. The endpoint that is called to get that information is [UserInfoEndpoint](https://www.googleapis.com/plus/v1/people/me) and you can read more about it here [Google Users Documentation](https://developers.google.com/+/web/api/rest/latest/people/get)
#### isLoggedInSubject(): BehaviorSubject<boolean>
You can subscribe to this BehaviorSubject to be notified when a user is logged in
#### logOut()
Logout, you can log the user out programmatically if that is what is needed, but the loggin component uses this when a user wants to log out.
#### startImplicitFlow() 
Starts the login process, used in the login component.
