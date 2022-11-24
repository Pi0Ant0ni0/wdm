import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/services/http.service";
import {Observable} from "rxjs";
import {SearchScheduleCommand, SearchScheduleResponseDTO} from "../model/search.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor(private _http: HttpService) { }

  /**
   *Make a search request on gateway
   * */
  public search=(command:SearchScheduleCommand):Observable<SearchScheduleResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    return this._http.post(url,command);
  }

  /**
   * Create new scheduler (if not exist in IntelxMS) given a query
   */

  public createScheduler=(command:SearchScheduleCommand):Observable<SearchScheduleResponseDTO>=>{
    let url = `${environment.gateway}/schedulers`;
    return this._http.post(url,command);
  }

  /**
   * Delete a scheduler given a query
   */

  public deleteScheduler=(command:SearchScheduleCommand):Observable<null>=>{
    let url = `${environment.gateway}/schedulers`;
    return this._http.delete(url,command);
  }

  /**
   *request history searches for a given query
   * */
  public history=(query:String, maxResult:number):Observable<SearchScheduleResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    return this._http.get(url,{query:query,maxResult:maxResult});
  }


}
