import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable,ReplaySubject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import jwtDecode from "jwt-decode";
import {Profile, UpdateProfileCommand} from "../model/auth.model";

@Injectable()
export class ProfileService {
	public profile$: ReplaySubject<Profile> = new ReplaySubject<Profile>(1);
	private _profile: Profile;


	constructor(private _oauthService: OAuthService, protected _http: HttpService) {
	}

  private get profile(): Profile {
    return this._profile;
  }

  private set profile(profile: Profile) {
    this._profile = profile;
    this.profile$.next(profile);
  }

  /**
   * load user logged details
   * */
	public loadUserProfile = (): Observable<Profile> => {
		return from(this._oauthService.loadUserProfile()).pipe(map((result: any) => {
			var decoded = <any>jwtDecode(this._oauthService.getAccessToken());
			const ret = new Profile();
			ret.email = result.info.email;
			ret.name = result.info.given_name;
			ret.surname = result.info.family_name;
			ret.userId = result.info.sub;
			ret.role = decoded.realm_access.roles || [];
			return ret;
		})).pipe(tap(result => {
			this.profile = result;
		}));
	}

  /**
   * Update current profile details
   * */
	public saveProfile = (profile: UpdateProfileCommand): Observable<Profile> => {
		return this.loadUserProfile().pipe(mergeMap((result: Profile) => {
			result.name = profile.name;
			result.surname = profile.surname;
			result.email = profile.email;
			return this._http.put(`${this._oauthService.issuer}/account/profile`, result);
		})).pipe(tap(result => {
			this.profile = result;
		}));
	}

  //TODO va implementato
	public changePassword = (): Observable<any> => {
		return null;
	}
}

