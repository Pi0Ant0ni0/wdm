import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of} from "rxjs";
import {HistoryResponseDTO, Search, SearchScheduleCommand, SearchScheduleResponseDTO} from "../model/search.model";
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
   * //FIXME
   * *Get latest 5 search for an alert
   * */
  public alertsList=(query:string):Observable<SearchScheduleResponseDTO>=>{
    let url = `${environment.gateway}/searches/${query}`;
    return this._http.get(url);
  }



  /*
  * Mockup come _alertList ma simula l'arrivo di un nuovo alert
  * **/
  public _alertList2= (query: string): Observable<Search[]> => {
    let dto: Search[] = [
      {
        id: "id1",
        title: "unisannio segreteria",
        category: "category1",
        date: new Date(),
        media: "txt",
        hasFile: false,
      },
      {
        id: "id2",
        title: "unisannio rettorato",
        category: "category2",
        date: new Date(),
        media: "txt",
        hasFile: true,
      },
    ];
    return of(dto);
  }


  /**
   * Mockup per avere gli ultimi  5 search di questo alert (alertsList)
   * */
  public _alertsList = (query: string): Observable<Search[]> => {
    let dto: Search[] = [
      {
        id: "id2",
        title: "unisannio rettorato",
        category: "category2",
        date: new Date(),
        media: "txt",
        hasFile: true,
      },
    ];
    return of(dto);
  }


  /**
   * mockup the search operation
   * */
  public _search = (command: SearchScheduleCommand): Observable<SearchScheduleResponseDTO> => {
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
      timestamp: new Date()
    };
    return of(dto);
  }



}
