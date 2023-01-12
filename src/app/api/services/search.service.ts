import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of} from "rxjs";
import {HistoryResponseDTO, Search, SearchCommand, SearchScheduleResponseDTO} from "../model/search.model";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor(private _http: HttpService) { }

  /**
   *Make a search request on gateway
   * */
  public search=(command:SearchCommand):Observable<SearchScheduleResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    //timestamp from java are in sec, we need them in millsec
    return this._http.post(url, command).pipe(map((s:SearchScheduleResponseDTO)=>{
      s.results=s.results.map((item:Search)=>{
        item.date=item.date*1000
        return item;
      });
      return s;
    }));
  }

  /**
   *request history searches for a given query
   * */
  public history=():Observable<HistoryResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    return this._http.get(url);
  }



}
