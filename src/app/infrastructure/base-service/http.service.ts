import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable()
export class HttpService {
  constructor(private http: HttpClient, private _router: Router) {
  }

  public get = <T = any>(url: string, data: any = {}, customHeaders: any = {}, responseType = "json"): Observable<T> => {
    let values = this.manageGetOptions(data, customHeaders);
    if (responseType) {
      values["responseType"] = responseType
    }
    return this.http.get<T>(url, values)
      .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
  }

  public post = <T = any>(url: string, data: any, customHeaders: any = {}): Observable<T> => {
    return this.http.post<T>(url, data, {headers: this.getHeaders(false, customHeaders)})
      .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
  }

  public put = <T = any>(url: string, data: any, customHeaders: any = {}): Observable<T> => {
    return this.http.put<T>(url, data, {headers: this.getHeaders(false, customHeaders)})
      .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
  }

  public delete = <T = any>(url: string, customHeaders: any = {}): Observable<T> => {
    return this.http.delete<T>(url, {headers: this.getHeaders(false, customHeaders)})
      .pipe(catchError((error, caught) => this.manageErrors(error, caught)));
  }


  private manageGetOptions = (data: any = {}, customHeaders: any = {}): any => {
    let parametersToSend: any = {};
    if (data != null) {
      for (let prop in data) {
        if (data[prop] != null) {
          parametersToSend[prop] = data[prop];
        }
      }
      if (data.keySelector) {
        parametersToSend["sort"] = data.keySelector + "," + ((data.ascending) ? "asc" : "desc");
      }
    }
    return {headers: this.getHeaders(false, customHeaders), params: parametersToSend};
  }

  protected manageErrors = (err: any, caught: Observable<any>): Observable<any> => {
    let errors = (err && err.error && err.error.errorMessage) ? err.error.errorMessage : err.error.error;
    let resultTuReturn;
    switch (err.status) {
      case 400:
        // let arr = new Array();
        // if (!(errors instanceof Array)) {
        //     if (errors != null) {
        //         arr.push(errors);
        //     }
        //     else {
        //         arr.push("Non trovato");
        //     }
        // }
        // else {
        //     arr = errors;
        // }
        this.showErrors(errors);
        // return throwError(() => new Error(errors))
        resultTuReturn = null;
      case 401:
        this.showErrors(["non possiedi l'autorizzazione necessaria"]);
        // return throwError(() => new Error(errors))
        resultTuReturn = null;
      case 403:
        this.showErrors(["non sei autenticato"]);
        // return throwError(() => new Error(errors));
        resultTuReturn = null;
      case 500:
        if (!(errors instanceof Array)) {
          if (errors != null) {
            errors = [errors];
          } else {
            errors = ["No description"];
          }
        }
        this.showErrors(errors);
        // return throwError(() => new Error(errors))
        resultTuReturn = null;
      default:
        // this._router.navigate(['/errors', err.status]);
        this.showErrors(errors);
        resultTuReturn = null;
      // return EMPTY;
    }
    return of(resultTuReturn);
  }

  private getHeaders = (forUpload: boolean = false, customHeaders: any = {}): HttpHeaders => {
    let ret = new HttpHeaders();
    for (let prop in customHeaders) {
      ret = ret.set(prop, customHeaders[prop]);
    }
    if (!forUpload) {
      ret = this.addHeader("Content-Type", "application/json; charset=utf-8", ret);
      ret = this.addHeader("Accept", "application/json", ret);
    }
    ret = this.manageHeaders(forUpload, ret);
    return ret;
  }

  private addHeader = (key: string, value: string, headers: HttpHeaders): HttpHeaders => {
    if (headers[key] == undefined) {
      headers = headers.set(key, value);
    }
    return headers;
  }

  protected manageHeaders = (forUpload: boolean = false, httpHeaders: HttpHeaders): HttpHeaders => {
    return httpHeaders
  }

  private showErrors = (errors: any) => {

  }

}
