import {Component, OnInit} from '@angular/core';
import {
  NbSearchService,
  NbToastrService
} from '@nebular/theme';
import {SearchService} from "../api/services/search.service";
import {Search, SearchScheduleCommand, SearchScheduleResponseDTO} from "../api/model/search.model";
import {Observable, of, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AlertDTO} from "../api/model/session.model";
import {SessionService} from "../api/services/session.service";

import {
  MqttService,
} from 'ngx-mqtt';
import {AuthConfigService} from "../../infrastructure/auth-service/auth-config.service";

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

  public alertsMap: Map<string, Search>;

  public message: string;

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: NbSearchService,
              private _searchGateway: SearchService,
              private _sessionService: SessionService,
              //private _profileService: ProfileService,
              private _mqttService: MqttService,
              private _toastrService: NbToastrService,
              private _oauthService: AuthConfigService
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

    // this._profileService.loadUserProfile().subscribe((user: Profile) => {
    //   this._sessionService.getAlertsByUserId(user.userId).subscribe((alerts: AlertDTO[]) => {
    //     this.alerts = alerts;
    //   });
    // });
    this._mockupAlerts("userId").subscribe(result => {
      this.alerts = result;
      this.alerts.forEach(()=> {
        // this._mqttService.observe(`${a.query}`).subscribe((message: IMqttMessage) => {
        //   this._showToast("Nuovo breach", JSON.parse(message.payload.toString()).title);
        //   //TODO Mandare notifica e mostrare nell'accordion
        // });
      });

    });
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
  private _mockup = (query: string): Observable<SearchScheduleResponseDTO> => {
    let dto: SearchScheduleResponseDTO = {
      result: [
        {
          title: "titolo1",
          category: "category1",
          date: new Date(),
          media: "media"
        },
        {
          title: "titolo2",
          category: "category2",
          date: new Date(),
          media: "media2"
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
