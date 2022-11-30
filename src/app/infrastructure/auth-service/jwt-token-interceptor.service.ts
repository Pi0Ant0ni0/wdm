import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthConfigService} from "./auth-config.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private _accountService: AuthConfigService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (this._accountService.isAuthenticated() && this._accountService.accessToken) {
			request = request.clone({
				setHeaders: { Authorization: `Bearer ${this._accountService.accessToken}` }
			});
		}

		return next.handle(request);
	}
}
