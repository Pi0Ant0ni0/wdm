import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of} from "rxjs";
import {HistoryResponseDTO, SearchCommand, SearchScheduleResponseDTO} from "../model/search.model";
import {environment} from "../../../environments/environment";

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
   * mockup the search operation
   * */
  public _search = (command: SearchCommand): Observable<SearchScheduleResponseDTO> => {
    let dto: SearchScheduleResponseDTO = {
      result: [
        {
          id: "id1",
          title: "CAM4",
          category: "category",
          date: new Date(),
          media: "txt",
          hasFile: false,
        },
        {
          id: "id2",
          title: "Yahoo Data Breach (2017)",
          category: "category",
          date: new Date(),
          media: ".dump",
          hasFile: true,
        },
      ],
      query: command.query,
      timestamp: new Date(),
      id:"id"
    };
    return of(dto);
  }


  /**
   *mockup
   * */
  public _history=():Observable<HistoryResponseDTO>=>{
    let dto: HistoryResponseDTO = {
      results: [
        {
          query: "unisannio.it",
          occurancy: 4,
        },
        {
          query: "google.it",
          occurancy: 6,
        },
        {
          query: "vatican.va",
          occurancy: 2,
        },
        {
          query: "aranzulla.it",
          occurancy: 4,
        },
        {
          query: "twitter.com",
          occurancy: 1,
        },
      ],
    };
    return of(dto);
  }



}
