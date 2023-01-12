import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {BreachDTO, DumpExistsResponse} from "../model/breach.model";

@Injectable({
  providedIn: 'root'
})
export class BreachService {

  constructor(private _http: HttpService) { }

  /**
   * get grepped string from dump
   * */
  public download=(fileName:String, query:string):Observable<BreachDTO>=>{

    if(fileName.includes("[") || fileName.includes("]")){
      fileName=fileName.replace("[","%5b");
      fileName=fileName.replace("]","%5d");
    }
    let url = `${environment.gateway}/breaches/${fileName}?query=${query}`;
    return this._http.get(url);
  }

  /**
   * check if dump exists
   * */
  public exists=(fileName:String):Observable<DumpExistsResponse>=>{

    if(fileName.includes("[") || fileName.includes("]")){
      fileName=fileName.replace("[","%5b");
      fileName=fileName.replace("]","%5d");
    }
    let url = `${environment.gateway}/breaches/${fileName}/present`;
    return this._http.get(url);
  }


}
