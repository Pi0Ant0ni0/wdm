import {Component, OnInit} from '@angular/core';
import {
  NbSearchService,
  NbToastrService
} from '@nebular/theme';
import {SearchService} from "../../api/services/search.service";
import {Search, SearchScheduleCommand, SearchScheduleResponseDTO} from "../../api/model/search.model";
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AlertDTO} from "../../api/model/session.model";
import {SessionService} from "../../api/services/session.service";

import {
  MqttService,
} from 'ngx-mqtt';
import {AuthConfigService} from "../../infrastructure/auth-service/auth-config.service";
import {HttpService} from "../../infrastructure/base-service/http.service";
import {HeaderService} from "../../infrastructure/@theme/components/header/header.service";

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

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: NbSearchService,
              private _searchGateway: SearchService,
              private _sessionService: SessionService,
              private _mqttService: MqttService,
              private _toastrService: NbToastrService,
              private _oauthService: AuthConfigService,
              private _headerService: HeaderService,
              private _httpService: HttpService
  ) {
    //subscribe to search event to make query
    this._searchService.onSearchSubmit().subscribe((result) => {
      this.query = result.term
      let query = result.term
      this._makeSearch(query);

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

    /**
     * get current alerts
     * */
    this.alerts=this._headerService.alert;

    /**
     * subscribe to alert update
     * */
    this._headerService.getCurrentAlerts().subscribe((alerts) => {
      this.alerts = alerts;
    });

    //retrieve latest alert
    this._headerService.getNewAlerts().subscribe((latest: Map<string, string>) => {
      for (let query of latest.keys()) {
        if (!(this.latestAlertIdMap.has(query)) || (this.latestAlertIdMap.has(query) && this.latestAlertIdMap.get(query) != latest.get(query))) {
          this._alertListUpdate(query).subscribe(result => {
            this.alertsMap.set(query, result);
            this.latestAlertIdMap = latest;
          });
          break;
        }
      }

    });
  }

  /**
   * get last 5 alerts for that query
   * */
  public getAlerts(query: string): void {
    this._alertsList(query).subscribe(alertList => {
      this.alertsMap.set(query, alertList);
    });
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
    this._search(searchCommand).subscribe((response: SearchScheduleResponseDTO) => {
      //generare i rettangoli per ogni risposta
      this.result = response.result;
    });
  }

  //create searchCommand and execute the search
  public createAlert = (query: string): void => {
    let searchCommand: SearchScheduleCommand = new SearchScheduleCommand();
    searchCommand.query = query;
    //qua bisogna chiamare il servizio reale di creazione dell'alert presente in session.service.ts
  }

  /*
  * Mockup come _alertList ma simula l'arrivo di un nuovo alert
  * **/
  private _alertListUpdate = (query: string): Observable<Search[]> => {
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
  private _alertsList = (query: string): Observable<Search[]> => {
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
   * mockup download request to downlaoad a dump
   * */
  private _download = (fileId: string): Observable<any> => {
    let downloadUrl = "https://doc-04-1g-docs.googleusercontent.com/docs/securesc/oihhfj0vpl33e1ar9ltv2duhii6m8gst/t1nv7k5n91bnumrjmak0l5alkl69gtq0/1669910625000/09767907814616499229/07478474742730928969Z/1sEzcuXre6bhJeiHScF3C_FCCf4lqefnv?e=download&uuid=67f14687-53d8-46d9-b0c5-a30609021911&nonce=dgff8me91um88&user=07478474742730928969Z&hash=5fn22qrtq2gvl2301t6pl8dn383buvn4";
    return this._httpService.get(downloadUrl, null, {"Access-Control-Allow-Origin": "*"}, "blob");
  }


  /**
   * mockup the search operation
   * */
  private _search = (command: SearchScheduleCommand): Observable<SearchScheduleResponseDTO> => {
    let dto: SearchScheduleResponseDTO = {
      result: [
        {
          id: "id1",
          title: "CAM4",
          category: "category",
          date: new Date(),
          media: "txt",
          hasFile: false,
        },
        {
          id: "id2",
          title: "Yahoo Data Breach (2017)",
          category: "category",
          date: new Date(),
          media: ".dump",
          hasFile: true,
        },
      ],
      query: command.query,
      timestamp: new Date()
    };
    return of(dto);
  }


}
