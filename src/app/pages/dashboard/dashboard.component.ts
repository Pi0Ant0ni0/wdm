import {Component, OnInit} from '@angular/core';
import {NbSearchService} from '@nebular/theme';
import {SearchService} from "../api/services/search.service";
import {Search, SearchScheduleCommand, SearchScheduleResponseDTO} from "../api/model/search.model";
import {Observable, of, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AlertDTO} from "../api/model/alert.model";
import {SessionService} from "../api/services/session.service";

import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions,
  MqttService,
} from 'ngx-mqtt';
import {BreachService} from "../api/services/breach.service";
import {ProfileService} from "../../infrastructure/services/profile.service";

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

  //servono per test MQTT
  private subscription: Subscription;
  public message: string;

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: NbSearchService,
              private _searchGateway: SearchService,
              private _sessionService: SessionService,
              //private _profileService: ProfileService
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
    this._mockupAlerts("userId").subscribe(resul=>{
      this.alerts=resul;
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
        fileName: "Pippo.txt",
        alertDate: new Date(),
      },
      {
        query: "query2",
        fileName: "Pluto.txt",
        alertDate: new Date(),
      },
      {
        query: "query3",
        fileName: "Paperino.txt",
        alertDate: new Date(),
      },
    ]
    return of(dto);
  }


}
