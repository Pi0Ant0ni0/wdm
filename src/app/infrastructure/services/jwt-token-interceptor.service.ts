import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthConfigService} from "../auth-service/auth-config.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private _accountService: AuthConfigService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		//
		// // add auth header with jwt if account is logged in and request is to the api url
		// // const isApiUrl = request.url.startsWith(environment.apiUrl);
		// const isApiUrl = true;
		//
		// if (this._accountService.() && this._accountService.getAccessToken() && isApiUrl) {
		// 	request = request.clone({
		// 		setHeaders: { Authorization: `Bearer ${this._accountService.getAccessToken()}` }
		// 	});
		// }

		return next.handle(request);
	}
}
