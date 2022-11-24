import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";

@Injectable()
export class AuthService {
	constructor(private _oauthService: OAuthService, protected http: HttpClient) {
		const config = this.getAuthConfig();
		this._oauthService.configure(config);
		this._oauthService.setStorage(sessionStorage);
		this._oauthService.setupAutomaticSilentRefresh();
		this._oauthService.requireHttps=false;
	}

	private getAuthConfig = (): AuthConfig => {
		let fullPath = document.head.baseURI;
		if (fullPath.endsWith("/")) {
			fullPath = fullPath.substr(0, fullPath.length - 1);
		}
		let ret = new AuthConfig();
		ret.issuer = environment.authentication.issuer;
		// ret.redirectUri = fullPath + (environment.authentication.redirectUri || "");
		ret.redirectUri = document.URL
			.replace(/[&\?]code=[^&\$]*/, '')
			.replace(/[&\?]scope=[^&\$]*/, '')
			.replace(/[&\?]state=[^&\$]*/, '')
			.replace(/[&\?]session_state=[^&\$]*/, '');

		ret.silentRefreshRedirectUri = fullPath + (environment.authentication.silentRefreshRedirectUri || "");
		ret.clientId = environment.authentication.clientId;
		ret.responseType = environment.authentication.responseType;
		ret.scope = environment.authentication.scope;
		ret.postLogoutRedirectUri = fullPath + (environment.authentication.postLogoutRedirectUri || "");
		return ret;
	}

	public verifyLogin = (): Observable<boolean> => {
		return from(this._oauthService.loadDiscoveryDocument().then(() =>
			this._oauthService.tryLogin()
		).then(() => {
			return this._oauthService.hasValidAccessToken();
		}, () => false));
	}

	public isAuthenticated = (): boolean => {
		return this._oauthService.hasValidAccessToken();
	}

	public getClaims = (): any => {
		return this.isAuthenticated() ? this._oauthService.getIdentityClaims() : null;
	}

	public getLoggedUserId = (): string => {
		return this.isAuthenticated() ? (<any>this._oauthService.getIdentityClaims()).sub : null;
	}

	public startLogin = (): void => {
		return this._oauthService.initCodeFlow();
	}

	public getAccessToken = (): string => {
		return this._oauthService.getAccessToken();
	}

	public logout = (): void => {
		return this._oauthService.logOut();
	}
}

