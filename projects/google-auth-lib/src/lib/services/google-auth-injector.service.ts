import { Injectable } from '@angular/core';
import { IClientConfig } from '../client-config.interface';
import { Router } from '@angular/router';
import { CallbackComponent } from '../callback/callback.component';
import { GoogleAuthService } from './google-auth.service';
import { LocalStorageService } from 'ngx-store';

@Injectable()
export class GoogleAuthInjector {
    private static instance: GoogleAuthService = null;

    // Return the instance of the service
    public static getInstance(config: IClientConfig, router: Router, storage: LocalStorageService): GoogleAuthService {
        if (GoogleAuthInjector.instance === null) {
            router.config.push(
                {
                    path: config.redirectUrl.split('/').pop(),
                    component: CallbackComponent
                }
            );
            router.resetConfig(router.config);
            GoogleAuthInjector.instance = new GoogleAuthService(config, router, storage);
        }
        return GoogleAuthInjector.instance;
    }
}
