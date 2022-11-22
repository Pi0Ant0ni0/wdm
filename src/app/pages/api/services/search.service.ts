import { Injectable } from '@angular/core';
import {HttpService} from "../../../infrastructure/services/http.service";
import {Observable} from "rxjs";
import {SearchCommand, SearchResponseDTO} from "../model/search.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor(private _http: HttpService) { }

  /**
   *Make a search request on gateway
   * */
  public search=(command:SearchCommand):Observable<SearchResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    return this._http.post(url,command);
  }

  /**
   *request history searches for a given query
   * */
  public history=(query:String, maxResult:number):Observable<SearchResponseDTO>=>{
    let url = `${environment.gateway}/searches`;
    return this._http.get(url,{query:query,maxResult:maxResult});
  }


}
