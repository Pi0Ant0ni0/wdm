import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/base-service/http.service";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BreachDTO} from "../model/breach.model";

@Injectable({
  providedIn: 'root'
})
export class BreachService {

  constructor(private _http: HttpService) { }

  /**
   * Download breach on Telegram
   * */
  public getBreach=(fileName:String):Observable<BreachDTO>=>{
    let url = `${environment.gateway}/breaches/${fileName}`;
    return this._http.get(url);
  }
}
