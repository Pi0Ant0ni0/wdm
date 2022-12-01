import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable} from "rxjs";
import {HistoryResponseDTO, SearchScheduleCommand, SearchScheduleResponseDTO} from "../model/search.model";
import {environment} from "../../../environments/environment";

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

  /**
   * download a dump
   * */
  private _download = (id: string): Observable<any> => {
    let url = `${environment.gateway}/breaches/${id}`;
    return this._http.get(url, null, {}, "blob");
  }


  /**
   * FIXME il path va aggiustato non me lo ricordo
   *Get latest 5 search for an alert
   * */
  public alertsList=(query:string):Observable<SearchScheduleResponseDTO>=>{
    let url = `${environment.gateway}/searches/${query}`;
    return this._http.get(url);
  }


}
