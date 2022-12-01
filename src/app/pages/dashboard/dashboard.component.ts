import {Component, OnInit} from '@angular/core';
import {
  NbSearchService,
  NbToastrService
} from '@nebular/theme';
import {SearchService} from "../api/services/search.service";
import {Search, SearchScheduleCommand, SearchScheduleResponseDTO} from "../api/model/search.model";
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AlertDTO} from "../api/model/session.model";
import {SessionService} from "../api/services/session.service";

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
  //result from query
  public result: Search[] = [];
  //alerts
  public alerts: AlertDTO[] = [];
  //map of alert and alertsList
  public alertsMap: Map<string, Search[]> = new Map();

  //latest alert i must highlight it
  public latestAlertIdMap: Map<string, string> = new Map();

  public message: string;

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
    this._searchService.onSearchSubmit().subscribe((result) => {
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

    //retrieve latest alert
    this._headerService.getAlerts().subscribe((latest: Map<string, string>) => {
      for (let query of latest.keys()) {
        if (! (this.latestAlertIdMap.has(query)) ) {
          this._getAlertsMockupUpdated(query).subscribe(result => {
            this.alertsMap.set(query, result);
            this.latestAlertIdMap = latest;
          });
          break;
        }
        if (this.latestAlertIdMap.has(query) && this.latestAlertIdMap.get(query) != latest.get(query)) {
          this._getAlertsMockupUpdated(query).subscribe(result => {
            this.alertsMap.set(query, result);
            this.latestAlertIdMap = latest;
          });
          break;
        }
      }

    });

    this._mockupAlerts("userId").subscribe(result => {
      this.alerts = result;
      this.alerts.forEach(() => {
        // this._mqttService.observe(`${a.query}`).subscribe((message: IMqttMessage) => {
        //   this._showToast("Nuovo breach", JSON.parse(message.payload.toString()).title);
        //   //TODO Mandare notifica e mostrare nell'accordion
        // });
      });

    });
  }

  /**
   * get last 5 alerts for that query
   * */
  public getAlerts(query: string): void {
    this._getAlertsMockup(query).subscribe(alertList => {
      this.alertsMap.set(query, alertList);
    });
  }


  /**
   * download specified dump
   * */
  public download(searchItem: Search) {
    this._download(searchItem.title).subscribe(file => {
      let data = new Blob([file], {type: 'application/bin'});
      let fileURL = URL.createObjectURL(data);
      window.open(fileURL);
    });

    //TODO here we need to call gateway to download the dump
  }

  //mockupDownlaod
  private _download = (id: string): Observable<any> => {
    let downloadUrl = "https://www.docdroid.net/file/download/XXgQpif/pre-covid-txt.txt";
    return this._httpService.get(downloadUrl, null, {}, "blob");
  }

  //create searchCommand and execute the search
  private _makeSearch = (query: string): void => {
    let searchCommand: SearchScheduleCommand = new SearchScheduleCommand();
    searchCommand.query = query;
    this._mockup(searchCommand.query).subscribe((response: SearchScheduleResponseDTO) => {
      //generare i rettangoli per ogni risposta
      this.result = response.result;
    });
  }

  //just for test purpose
  private _getAlertsMockup = (query: string): Observable<Search[]> => {
    let dto: Search[] = [
      {
        id: "id2",
        title: "titolo2",
        category: "category2",
        date: new Date(),
        media: "media2",
        hasFile: true,
      },
    ];
    return of(dto);
  }

  //just for test purpose
  private _getAlertsMockupUpdated = (query: string): Observable<Search[]> => {
    let dto: Search[] = [
      {
        id: "id1",
        title: "titolo1",
        category: "category1",
        date: new Date(),
        media: "media",
        hasFile: false,
      },
      {
        id: "id2",
        title: "titolo2",
        category: "category2",
        date: new Date(),
        media: "media2",
        hasFile: true,
      },
    ];
    return of(dto);
  }


  //just for test purpose
  private _mockup = (query: string): Observable<SearchScheduleResponseDTO> => {
    let dto: SearchScheduleResponseDTO = {
      result: [
        {
          id: "id1",
          title: "titolo1",
          category: "category1",
          date: new Date(),
          media: "media",
          hasFile: false,
        },
        {
          id: "id2",
          title: "titolo2",
          category: "category2",
          date: new Date(),
          media: "media2",
          hasFile: true,
        },
      ],
      query: query,
      timestamp: new Date()
    };
    return of(dto);
  }

  //just for test purpose
  private _mockupAlerts = (userId: string): Observable<AlertDTO[]> => {
    let dto: AlertDTO[] = [
      {
        query: "query1",
        alertDate: new Date(),
      },
      {
        query: "query2",
        alertDate: new Date(),
      },
      {
        query: "query3",
        alertDate: new Date(),
      },
    ]
    return of(dto);
  }


}
