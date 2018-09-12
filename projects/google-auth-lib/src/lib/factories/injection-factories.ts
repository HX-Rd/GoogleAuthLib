import { GoogleAuthService } from "../services/google-auth.service";
import { IClientConfig } from "../client-config.interface";
import { Router } from "@angular/router";
import { GoogleAuthInjector } from "../services/google-auth-injector.service";
import { LocalStorageService } from "ngx-store";

export function GoogleAuthFactory(config: IClientConfig, router: Router, storage: LocalStorageService): GoogleAuthService {
  return GoogleAuthInjector.getInstance(config, router, storage);
}
