import {Injectable} from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of, Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {AlertDTO, CreateSessionCommand, SessionDTO, Token, UpdateSessionCommand} from "../model/session.model";
import {ScheduleCommand, Search} from "../model/search.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static _currentAlert: AlertDTO[] = [];

  public latestAlertsMapSubject: Subject<Map<string, string>> = new Subject<Map<string, string>>();
  public currentAlertsSubject: Subject<AlertDTO[]> = new Subject<AlertDTO[]>();


  constructor(private _http: HttpService) {
  }

  public get currentAlerts(): AlertDTO[] {
    return SessionService._currentAlert;
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
    SessionService._currentAlert = alerts;
  }

  public create = (userId: string, command: CreateSessionCommand): Observable<SessionDTO> => {
    let url = `${environment.gateway}/sessions`;
    return this._http.post(url, command).pipe((map((session: SessionDTO) => {
      SessionService._currentAlert = session.alertDTOs?session.alertDTOs:[];
      this.emitCurrentAlerts(this.currentAlerts);
      return session;
    })));
  }


  /**
   *Update session
   * */
  public updateSession = (userId: string, sessionCommand: UpdateSessionCommand): Observable<SessionDTO> => {
    let url = `${environment.gateway}/sessions/${userId}`;
    return this._http.put(url, sessionCommand);
  }

  /**
   * get sessions
   * */
  public getSession = (userId: string): Observable<SessionDTO> => {
    let url = `${environment.gateway}/sessions`;
    return this._http.get(url).pipe(map((response: SessionDTO) => {
      SessionService._currentAlert = response.alertDTOs;
      console.log("alert sul service get: ",SessionService._currentAlert)
      this.emitCurrentAlerts(this.currentAlerts);
      return response;
    }));
  }


  /**
   * Add alert for the user specified
   * */
  public createAlert = (userId: string, command: ScheduleCommand): Observable<void> => {
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.post(url, command).pipe((map(() => {
      this.getSession(userId).subscribe((session: SessionDTO) => {
        //aggiorno gli alert dell'utente
        SessionService._currentAlert = session.alertDTOs?session.alertDTOs:[];
        console.log("alert sul service post alert: ",SessionService._currentAlert)
        this.emitCurrentAlerts(this.currentAlerts);
      })
    })));
  }


  /**
   * Delete alert for the user specified
   * */
  public deleteAlert = (userId: string, alertQuery: string): Observable<void> => {
    let url = `${environment.gateway}/sessions/${userId}/alerts/${alertQuery}`;
    return this._http.delete(url).pipe(map(() => {
      this._http.get(url).pipe(map((response: SessionDTO) => {
        SessionService._currentAlert = response.alertDTOs?response.alertDTOs:[];
        console.log("alert sul service delete alert: ",SessionService._currentAlert)

        this.emitCurrentAlerts(this.currentAlerts);
        return;
      }));
    }));
  }


  /**
   * get searches from alerts
   * */
  public getAlertList = (userId: string, alertQuery: string): Observable<Search[]> => {
    let url = `${environment.gateway}/sessions/${userId}/alerts/${alertQuery}`;
    return this._http.get(url);
  }


  /**
   * get intelxToken
   * */
  public getToken = (): Observable<Token> => {
    let url = `${environment.gateway}/sessions/config/token`
    return this._http.get(url);
  }



  /**
   * update intelxToken
   * */
  public setToken = (token:string): Observable<void> => {
    let url = `${environment.gateway}/sessions/config/token`
    return this._http.put(url,token);
  }


  /**
   *
   * MOCKUP
   *
   * */


  /*
  * Mockup come _alertList ma simula l'arrivo di un nuovo alert
  * **/
  public _getAlertList2 = (userId: string, alertQuery: string): Observable<Search[]> => {
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
  public _getAlertList = (userId: string, alertQuery: string): Observable<Search[]> => {
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




}
