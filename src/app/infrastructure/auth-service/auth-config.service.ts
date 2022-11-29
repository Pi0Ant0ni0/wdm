import { Injectable } from '@angular/core';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import {filter, map} from 'rxjs/operators';
import {from, Observable} from "rxjs";
import {Profile} from "../model/auth.model";
import jwtDecode from "jwt-decode";

@Injectable()
export class AuthConfigService {

  private _decodedAccessToken: string;
  private _decodedIDToken: string;
  get decodedAccessToken() { return this._decodedAccessToken; }
  get decodedIDToken() { return this._decodedIDToken; }

  constructor(
    private readonly _oauthService: OAuthService,
    private readonly authConfig: AuthConfig
  ) {}

  public getProfile = (): Observable<Profile> => {
    return from(this._oauthService.loadUserProfile()).pipe(map((result: any) => {
      let decoded = <any>jwtDecode(this._oauthService.getAccessToken());
      const ret = new Profile();
      ret.email = result.info.email;
      ret.name = result.info.given_name;
      ret.surname = result.info.family_name;
      ret.userId = result.info.sub;
      ret.role= decoded.realm_access.roles?decoded.realm_access.roles[0]:"";
      return ret;
    }));
  }

  async initAuth(): Promise<any> {
    return new Promise<void>((resolveFn, rejectFn) => {
      // setup oauthService
      this._oauthService.configure(this.authConfig);
      this._oauthService.setStorage(localStorage);
      this._oauthService.tokenValidationHandler = new NullValidationHandler();

      // subscribe to token events
      this._oauthService.events
        .pipe(filter((e: any) => {
          return e.type === 'token_received';
        }))
        .subscribe(() => this.handleNewToken());

      // continue initializing app or redirect to login-page

      this._oauthService.loadDiscoveryDocumentAndLogin().then(isLoggedIn => {
        if (isLoggedIn) {
          this._oauthService.setupAutomaticSilentRefresh();
          resolveFn();
        } else {
          this._oauthService.initImplicitFlow();
          rejectFn();
        }
      });

    });
  }

  private handleNewToken() {
    this._decodedAccessToken = this._oauthService.getAccessToken();
    this._decodedIDToken = this._oauthService.getIdToken();
  }

  public logout(){
    this._oauthService.logOut();
  }

}
