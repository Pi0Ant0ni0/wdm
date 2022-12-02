import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {AlertDTO} from "../../../../api/model/session.model";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  // public latestAlerts: Subject<Map<string, string>> = new Subject<Map<string, string>>();
  // public alerts: Subject<AlertDTO[]> = new Subject<AlertDTO[]>();
  // public alert:AlertDTO[] =[];
  //
  // constructor() {
  // }
  //
  // public getNewAlerts = (): Observable<Map<string, string>> => {
  //   return this.latestAlerts.asObservable();
  // }
  //
  // public getCurrentAlerts = (): Observable<AlertDTO[]> => {
  //   return this.alerts.asObservable();
  // };
  //
  // public emitAlerts = (params: Map<string, string>): void => {
  //   this.latestAlerts.next(params);
  // }
  //
  // public emitCurrentAlerts = (alerts: AlertDTO[]): void => {
  //   this.alerts.next(alerts);
  //   this.alert=alerts;
  // }


}
