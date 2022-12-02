import {Component, OnInit} from '@angular/core';
import {
  NbSearchService,
  NbToastrService
} from '@nebular/theme';
import {SearchService} from "../../api/services/search.service";
import {Search, SearchScheduleCommand, SearchScheduleResponseDTO} from "../../api/model/search.model";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AlertDTO} from "../../api/model/session.model";
import {SessionService} from "../../api/services/session.service";

import {
  MqttService,
} from 'ngx-mqtt';
import {AuthConfigService} from "../../infrastructure/auth-service/auth-config.service";
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Profile} from "../../infrastructure/auth-service/auth-model/auth.model";

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  //search query
  public query:string;

  //result from query
  public result: Search[] = [];
  //alerts
  public alerts: AlertDTO[] = [];
  //map of alert and alertsList
  public alertsMap: Map<string, Search[]> = new Map();

  //latest alert i must highlight it
  public latestAlertIdMap: Map<string, string> = new Map();

  //user logged in
  private _profile:Profile;

  //FIXME remove solo per dinamicita
  private _newServices:boolean =false;

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: NbSearchService,
              private _searchGateway: SearchService,
              private _sessionService: SessionService,
              private _mqttService: MqttService,
              private _toastrService: NbToastrService,
              private _oauthService: AuthConfigService,
              private _httpService: HttpService,
              private _profileService: AuthConfigService,
  ) {
    //subscribe to search event to make query
    this._searchService.onSearchSubmit().subscribe((result) => {
      this.query = result.term
      this._makeSearch(this.query);
    });
  }


  //if there are search params from previous search we execute the search
  ngOnInit(): void {

    this._activatedRoute.queryParams.subscribe((params) => {
      let searchQuery = params["search"];
      if (searchQuery) {
        this._makeSearch(searchQuery);
      }
    });

    this._profileService.profile.subscribe((profile: Profile) => {
      this._profile = profile;
      /**
       * get current alerts
       * */
      this.alerts = this._sessionService.currentAlerts;

      /**
       * subscribe to alert update
       * */
      this._sessionService.getCurrentAlertsObservable().subscribe((alerts) => {
        this.alerts = alerts;
      });

      //retrieve latest alert
      this._sessionService.getLatestAlertObservable().subscribe((latest: Map<string, string>) => {
          this.latestAlertIdMap = latest;
          this._newServices = true;
          for (let query of latest.keys()) {
            this._searchGateway._alertList2(query).subscribe(alertList => {
              this.alertsMap.set(query, alertList);
            });
          }
          console.log(this.alertsMap);
        });
    });
  }

  /**
   * get last 5 alerts for that query
   * */
  public getAlerts(query: string): void {
    if(this._newServices){
      this._searchGateway._alertList2(query).subscribe(alertList=>{
        this.alertsMap.set(query,alertList);
      });
    }else {
      this._searchGateway._alertsList(query).subscribe(alertList => {
        this.alertsMap.set(query, alertList);
      });
    }
  }


  /**
   * download specified dump
   * */
  public download(searchItem: Search) {
    this._download(searchItem.title).subscribe(file => {
      let data = new Blob([file], {type: 'application/bin'},);
      let fileURL: string = URL.createObjectURL(data);
      console.log(fileURL);
      window.open(fileURL);
    });

    //TODO here we need to call gateway to download the dump
  }

  //create searchCommand and execute the search
  private _makeSearch = (query: string): void => {
    let searchCommand: SearchScheduleCommand = new SearchScheduleCommand();
    searchCommand.query = query;
    this._searchGateway._search(searchCommand).subscribe((response: SearchScheduleResponseDTO) => {
      //generare i rettangoli per ogni risposta
      this.result = response.result;
    });
  }

  //crea un nuovo alert per l'utente
  public createAlert = (): void => {
    let searchCommand: SearchScheduleCommand = new SearchScheduleCommand();
    searchCommand.query = this.query;
    this._sessionService._createAlert(this._profile.userId,{query:this.query}).subscribe();
  }

  //delete alert
  public deleteAlert = (query:string): void => {
    let searchCommand: SearchScheduleCommand = new SearchScheduleCommand();
    searchCommand.query = this.query;
    this._sessionService._deleteAlert(this._profile.userId,{query:query}).subscribe();
  }




  /**
   * mockup download request to downlaoad a dump
   * */
  private _download = (fileId: string): Observable<any> => {
    let downloadUrl = "https://doc-04-1g-docs.googleusercontent.com/docs/securesc/oihhfj0vpl33e1ar9ltv2duhii6m8gst/t1nv7k5n91bnumrjmak0l5alkl69gtq0/1669910625000/09767907814616499229/07478474742730928969Z/1sEzcuXre6bhJeiHScF3C_FCCf4lqefnv?e=download&uuid=67f14687-53d8-46d9-b0c5-a30609021911&nonce=dgff8me91um88&user=07478474742730928969Z&hash=5fn22qrtq2gvl2301t6pl8dn383buvn4";
    return this._httpService.get(downloadUrl, null, {"Access-Control-Allow-Origin": "*"}, "blob");
  }





}
