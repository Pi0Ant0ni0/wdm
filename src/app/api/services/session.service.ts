import { Injectable } from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of, Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {AlertDTO, SessionDTO, UpdateSessionCommand} from "../model/session.model";
import {SearchScheduleCommand} from "../model/search.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  public latestAlertsMapSubject: Subject<Map<string, string>> = new Subject<Map<string, string>>();
  public currentAlertsSubject: Subject<AlertDTO[]> = new Subject<AlertDTO[]>();
  private _currentAlert:AlertDTO[] =[];

  constructor(private _http:HttpService) { }

  public get currentAlerts():AlertDTO[]{
    return this._currentAlert;
  }

  public getLatestAlertObservable = (): Observable<Map<string, string>> => {
    return this.latestAlertsMapSubject.asObservable();
  }

  public getCurrentAlertsObservable = (): Observable<AlertDTO[]> => {
    return this.currentAlertsSubject.asObservable();
  };

  public emitLatestAlertsMap = (params: Map<string, string>): void => {
    this.latestAlertsMapSubject.next(params);
  }

  public emitCurrentAlerts = (alerts: AlertDTO[]): void => {
    this.currentAlertsSubject.next(alerts);
    this._currentAlert=alerts;
  }

  /**
   * Add alert for the user specified
   * */
  public createAlert=(userId:string, command: SearchScheduleCommand):Observable<void>=>{
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    //
    return this._http.post(url, command).pipe(((response)=>{
      this.getSession(userId).subscribe((session:SessionDTO)=>{
        //aggiorno gli alert dell'utente
        this._currentAlert=session.alerts;
        //emetto il nuovo valore
        this.emitCurrentAlerts(this._currentAlert);
      });
      return response;
    }));
  }


  /**
   *Update session
   * */
  public updateSession=(userId:string,sessionCommand: UpdateSessionCommand):Observable<void>=>{
    let url = `${environment.gateway}/sessions/${userId}`;
    return this._http.put(url, sessionCommand);
  }

  /**
   * Delete alert for the user specified
   * */
  public deleteAlert=(userId:string, command: SearchScheduleCommand):Observable<void>=>{
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.delete(url, command).pipe(map(()=>{
      this._http.get(url).pipe(map((response:SessionDTO)=>{
        this._currentAlert=response.alerts;
        this.emitCurrentAlerts(this.currentAlerts);
        return;
      }));
    }));
  }

  /**
   * get alerts for the user specified
   * */
  public getSession=(userId:string):Observable<SessionDTO>=>{
    let url = `${environment.gateway}/sessions/${userId}`;
    return this._http.get(url).pipe(map((response:SessionDTO)=>{
      this._currentAlert=response.alerts;
      this.emitCurrentAlerts(this.currentAlerts);
      return response;
    }));
  }



  /**
   *
   * MOCKUP
   *
   * */


  /**
   *MOCKUP  Delete alert for the user specified
   * */
  public _deleteAlert=(userId:string, command: SearchScheduleCommand):Observable<void>=>{
    this._currentAlert =this._currentAlert.filter(function(value, index, arr){
      return value.query != command.query;
    });
    this.emitCurrentAlerts(this._currentAlert);
    return of();
  }




  /**
   * mockup for createAlert
   * */
  public _createAlert=(userId:string, command: SearchScheduleCommand):Observable<void>=>{
    let dto: AlertDTO=
      {
        query: command.query,
        alertDate: new Date(),
      };
    this._currentAlert.push(dto);
    this.emitCurrentAlerts(this._currentAlert);
    return of();
  }



  /**
   * mockup for get session operation
   * */
  public _getSession = (userId: string): Observable<SessionDTO> => {
    let dto: AlertDTO[] = [
      {
        query: "unisannio.it",
        alertDate: new Date(),
      },
      {
        query: "studenti.unisannio.it",
        alertDate: new Date(),
      },
      {
        query: "investireFacile.it",
        alertDate: new Date(),
      },
    ]
    let session: SessionDTO =
      {
        alerts: dto,
        theme: "cosmic",
      };
    this._currentAlert=dto;
    this.emitCurrentAlerts(dto);
    return of(session);
  }


  /**
   * mockup for updateSession when changing theme
   * */
  public _updateSession=(userId:string, command:UpdateSessionCommand):Observable<void>=>{
    console.log("theme changed");
    return of();
  }



}
