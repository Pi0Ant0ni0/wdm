import { Injectable } from '@angular/core';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import {map} from 'rxjs/operators';
import {from, Observable} from "rxjs";
import {Profile} from "./auth-model/auth.model";
import jwtDecode from "jwt-decode";

@Injectable()
export class AuthConfigService {


  constructor(
    private readonly _oauthService: OAuthService,
    private readonly authConfig: AuthConfig
  ) {}


  /**
   * get user logged in
   * */
  public get profile (): Observable<Profile>{
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

  /**
   * check if user is authenticated
   * */
  public isAuthenticated = (): boolean => {
    return this._oauthService.hasValidAccessToken();
  }

  /**
   * return access token to make request
   * */
  public get accessToken():string{
    return this._oauthService.getAccessToken();
  }

  /**
   * execute logout for current user
   * */
  public logout(){
    this._oauthService.logOut();
  }

}
