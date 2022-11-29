import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/services/http.service";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AlertDTO} from "../model/session.model";
import {SearchScheduleCommand} from "../model/search.model";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private _http:HttpService) { }

  /**
   * Add alert for the user specified
   * */
  public addAlert=(userId:string, command: SearchScheduleCommand):Observable<void>=>{
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.post(url, command);
  }

  /**
   * Delete alert for the user specified
   * */
  public deleteAlert=(userId:string, command: SearchScheduleCommand):Observable<void>=>{
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.delete(url, command);
  }

  /**
   * get alerts for the user specified
   * */
  public getAlertsByUserId=(userId:string):Observable<AlertDTO[]>=>{
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.get(url);
  }
}
