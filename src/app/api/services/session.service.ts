import {Injectable} from '@angular/core';
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Observable, of, Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {AlertDTO, CreateSessionCommand, SessionDTO, UpdateSessionCommand} from "../model/session.model";
import {ScheduleCommand, Search} from "../model/search.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static _currentAlert: AlertDTO[] = [{
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
  private static _session: SessionDTO = {
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
  public create = (userId: string, command: CreateSessionCommand): Observable<SessionDTO> => {
    let url = `${environment.gateway}/sessions`;
    return this._http.post(url, command).pipe((map((session: SessionDTO) => {
      SessionService._session = session;
      return session;
    })));
  }


  /**
   *Update session
   * */
  public updateSession = (userId: string, sessionCommand: UpdateSessionCommand): Observable<SessionDTO> => {
    let url = `${environment.gateway}/sessions/${userId}`;
    return this._http.put(url, sessionCommand).pipe((map((session: SessionDTO) => {
      SessionService._session = session;
      return session;
    })));
  }

  /**
   * get sessions
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
   * Add alert for the user specified
   * */
  public createAlert = (userId: string, command: ScheduleCommand): Observable<void> => {
    let url = `${environment.gateway}/sessions/${userId}/alerts`;
    return this._http.post(url, command).pipe((map(() => {
      this.getSession(userId).subscribe((session: SessionDTO) => {
        //aggiorno gli alert dell'utente
        SessionService._currentAlert = session.alerts;
        SessionService._session = session;
        //emetto il nuovo valore
        this.emitCurrentAlerts(SessionService._currentAlert);
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
        SessionService._currentAlert = response.alerts;
        SessionService._session=response;
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


  /**
   *MOCKUP  Delete alert for the user specified
   * */
  public _deleteAlert = (userId: string, queryName: string): Observable<void> => {
    SessionService._currentAlert = SessionService._currentAlert.filter(function (value) {
      return value.query != queryName;
    });
    this.emitCurrentAlerts(SessionService._currentAlert);
    return of();
  }

  /**
   * mockup for createAlert
   * */
  public _createAlert = (userId: string, command: ScheduleCommand): Observable<void> => {
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
