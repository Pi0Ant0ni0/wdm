import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {BreachDTO} from "../model/breach.model";

@Injectable({
  providedIn: 'root'
})
export class BreachService {

  constructor(private _http: HttpService) { }

  /**
   * get grepped string from dump
   * */
  public download=(fileName:String):Observable<BreachDTO>=>{
    let url = `${environment.gateway}/breaches/${fileName}`;
    return this._http.get(url,);
  }


  /**
   * get grepped string from dump
   * */
  public _download=(fileName:String):Observable<BreachDTO>=>{
    return of({result:"link: tinder.com, userName:franco, password:frattolillo78"});
  }
}
