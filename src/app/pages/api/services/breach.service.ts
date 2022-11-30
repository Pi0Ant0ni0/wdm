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
   * Test if breach is present on Telegram
   * */
  public breachIsPresent=(fileName:String):Observable<boolean>=>{
    let url = `${environment.gateway}/breaches`;
    return this._http.get(url,{query:fileName});
  }

  /**
   * Download breach on Telegram
   * */
  public getBreach=(fileName:String):Observable<BreachDTO>=>{
    let url = `${environment.gateway}/breaches/${fileName}`;
    return this._http.get(url);
  }
}
