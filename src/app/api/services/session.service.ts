import {Injectable} from '@angular/core';
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

  public static _currentAlert: AlertDTO[] = [{
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
  ];
  public static _session: SessionDTO = {
    alerts: SessionService._currentAlert,
    theme: "cosmic",
    intelxToken: null,
  };


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

  /**
   * Add alert for the user specified
   * */
  public createAlert = (userId: string, command: SearchScheduleCommand): Observable<void> => {
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    //
    return this._http.post(url, command).pipe(((response) => {
      this.getSession(userId).subscribe((session: SessionDTO) => {
        //aggiorno gli alert dell'utente
        SessionService._currentAlert = session.alerts;
        //emetto il nuovo valore
        this.emitCurrentAlerts(SessionService._currentAlert);
      });
      return response;
    }));
  }


  /**
   *Update session
   * */
  public updateSession = (userId: string, sessionCommand: UpdateSessionCommand): Observable<void> => {
    let url = `${environment.gateway}/sessions/${userId}`;
    return this._http.put(url, sessionCommand);
  }

  /**
   * Delete alert for the user specified
   * */
  public deleteAlert = (userId: string, command: SearchScheduleCommand): Observable<void> => {
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.delete(url, command).pipe(map(() => {
      this._http.get(url).pipe(map((response: SessionDTO) => {
        SessionService._currentAlert = response.alerts;
        this.emitCurrentAlerts(this.currentAlerts);
        return;
      }));
    }));
  }

  /**
   * get alerts for the user specified
   * */
  public getSession = (userId: string): Observable<SessionDTO> => {
    let url = `${environment.gateway}/sessions/${userId}`;
    return this._http.get(url).pipe(map((response: SessionDTO) => {
      SessionService._currentAlert = response.alerts;
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
  public _deleteAlert = (userId: string, command: SearchScheduleCommand): Observable<void> => {
    SessionService._currentAlert = SessionService._currentAlert.filter(function (value) {
      return value.query != command.query;
    });
    this.emitCurrentAlerts(SessionService._currentAlert);
    return of();
  }

  /**
   * mockup for createAlert
   * */
  public _createAlert = (userId: string, command: SearchScheduleCommand): Observable<void> => {
    let dto: AlertDTO =
      {
        query: command.query,
        alertDate: new Date(),
      };
    SessionService._currentAlert.push(dto);
    this.emitCurrentAlerts(SessionService._currentAlert);
    return of();
  }


  /**
   * mockup for get session operation
   * */
  public _getSession = (userId: string): Observable<SessionDTO> => {
    this.emitCurrentAlerts(SessionService._currentAlert);
    return of(SessionService._session);
  }


  /**
   * mockup for updateSession when changing theme
   * */
  public _updateSession = (userId: string, command: UpdateSessionCommand): Observable<any> => {
    command.intelxToken ? SessionService._session.intelxToken = command.intelxToken : console.log("token not setted");
    command.theme ? SessionService._session.theme = command.theme : console.log("theme not setted");
    return of("");
  }


}
