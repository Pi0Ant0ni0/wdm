import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public alerts: Subject<Map<string,string>> = new Subject<Map<string,string>>();

  constructor() { }

  public getAlerts=():Observable<Map<string,string>> =>{
    return this.alerts.asObservable();

  }

  public emitAlerts=(params:Map<string,string>):void =>{
    this.alerts.next(params);
  }





}
