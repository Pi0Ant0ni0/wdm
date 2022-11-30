import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/base-service/http.service";
import {Observable} from "rxjs";
import {HistoryResponseDTO, SearchScheduleCommand, SearchScheduleResponseDTO} from "../model/search.model";
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
    return this._http.post(url, command);
  }

  /**
   *request history searches for a given query
   * */
  public history=():Observable<HistoryResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    return this._http.get(url);
  }

}
