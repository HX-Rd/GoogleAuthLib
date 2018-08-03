import { GoogleAuthService } from "../services/google-auth.service";
import { IClientConfig } from "../client-config.interface";
import { Router } from "@angular/router";
import { NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StorageBrige } from "../services/storage-bridge.service";
import { ValidationHandler, UrlHelperService } from "angular-oauth2-oidc";
import { GoogleAuthInjector } from "../services/google-auth-injector.service";
import { LocalStorageService } from "ngx-store";
import { LocalStorageBrigeInjector } from "../services/local-storage-brige-injector.service";

export function GoogleAuthFactory(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GoogleAuthService {
  return GoogleAuthInjector.getInstance(config, router, ngZone, httpClient, storageBrige, validationHandler, urlHelperService);
}

export function StorageBrigeFactory(localStorageService: LocalStorageService): StorageBrige {
  return LocalStorageBrigeInjector.getInstance(localStorageService);
}
