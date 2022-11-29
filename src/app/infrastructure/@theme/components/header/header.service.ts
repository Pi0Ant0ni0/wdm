import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Search} from "../../../../pages/api/model/search.model";
import {AlertDTO} from "../../../../pages/api/model/session.model";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public alerts: Subject<Map<string, Search[]>> = new Subject<Map<string, Search[]>>();

  constructor() { }

  public getAlerts=():Observable<Map<string, Search[]>> =>{
    return this.alerts.asObservable();

  }

  public emitAlerts=(params:Map<string, Search[]>):void =>{
    this.alerts.next(params);
  }





}
