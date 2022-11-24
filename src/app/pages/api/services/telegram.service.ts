import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/services/http.service";
import {SearchScheduleCommand, SearchScheduleResponseDTO} from "../model/search.model";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BreachDTO} from "../model/breach.model";

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  constructor(private _http: HttpService) { }

  /**
   * Test if breach is present on Telegram
   * */
  public breachIsPresent=(fileName:String):Observable<boolean>=>{
    let url = `${environment.telegram}/breaches/${fileName}/present`;
    return this._http.get(url);
  }

  /**
   * Download breach on Telegram
   * */
  public getBreach=(fileName:String):Observable<BreachDTO>=>{
    let url = `${environment.telegram}/breaches/${fileName}`;
    return this._http.get(url);
  }
}