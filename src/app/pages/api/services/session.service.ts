import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/services/http.service";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AlertDTO} from "../model/alert.model";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private _http:HttpService) { }

  /**
   * get alerts for the user specified
   * */
  public getAlertsByUserId=(userId:string):Observable<AlertDTO[]>=>{
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.get(url);
  }
}
