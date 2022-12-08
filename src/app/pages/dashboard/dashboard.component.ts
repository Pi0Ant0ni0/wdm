import {Component, OnInit} from '@angular/core';
import {
  NbDialogService,
  NbSearchService,
  NbToastrService
} from '@nebular/theme';
import {SearchService} from "../../api/services/search.service";
import {ScheduleCommand, Search, SearchCommand, SearchScheduleResponseDTO} from "../../api/model/search.model";

import {ActivatedRoute} from "@angular/router";
import {AlertDTO} from "../../api/model/session.model";
import {SessionService} from "../../api/services/session.service";

import {
  MqttService,
} from 'ngx-mqtt';
import {AuthConfigService} from "../../infrastructure/auth-service/auth-config.service";
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Profile} from "../../infrastructure/auth-service/auth-model/auth.model";
import {FormControl} from "@angular/forms";
import {BreachService} from "../../api/services/breach.service";
import {BreachDTO} from "../../api/model/breach.model";
import {
  GenericDialogComponent
} from "../../infrastructure/@theme/components/header/user-details/generic-dialog.component";

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
  public dateFilter:FormControl = new FormControl();

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: NbSearchService,
              private _searchGateway: SearchService,
              private _sessionService: SessionService,
              private _mqttService: MqttService,
              private _toastrService: NbToastrService,
              private _oauthService: AuthConfigService,
              private _httpService: HttpService,
              private _profileService: AuthConfigService,
              private _breachService:BreachService,
              private _dialogService:NbDialogService
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
            this._sessionService._getAlertList2(this._profile.userId,query).subscribe(alertList => {
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
      this._sessionService._getAlertList2(this._profile.userId,query).subscribe(alertList=>{
        this.alertsMap.set(query,alertList);
      });
    }else {
      this._sessionService._getAlertList(this._profile.userId,query).subscribe(alertList => {
        this.alertsMap.set(query, alertList);
      });
    }
  }


  /**
   * download specified dump
   * */
  public download(searchItem: Search) {
    this._breachService._download(searchItem.title).subscribe((data:BreachDTO)=>{
      this._dialogService.open(GenericDialogComponent,{
        context:{
          title:`Data grepped from ${searchItem.title}`,
          description:data.result
        }
      });

    });
  }

  //create searchCommand and execute the search
  private _makeSearch = (query: string): void => {
    let searchCommand: SearchCommand = new SearchCommand();
    searchCommand.query = query;
    this._searchGateway._search(searchCommand).subscribe((response: SearchScheduleResponseDTO) => {
      //generare i rettangoli per ogni risposta
      this.result = response.result;
    });
  }

  //crea un nuovo alert per l'utente
  public createAlert = (): void => {
    let searchCommand: ScheduleCommand = new ScheduleCommand();
    searchCommand.query = this.query;
    this._sessionService._createAlert(this._profile.userId,{query:this.query}).subscribe();
  }

  //delete alert
  public deleteAlert = (query:string): void => {
    this._sessionService._deleteAlert(this._profile.userId,query).subscribe();
  }





}
