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

import {AuthConfigService} from "../../infrastructure/auth-service/auth-config.service";
import {HttpService} from "../../infrastructure/base-service/http.service";
import {Profile} from "../../infrastructure/auth-service/auth-model/auth.model";
import {FormControl} from "@angular/forms";
import {BreachService} from "../../api/services/breach.service";
import {BreachDTO, DumpExistsResponse} from "../../api/model/breach.model";
import {
  GenericDialogComponent
} from "../../infrastructure/@theme/components/header/user-details/generic-dialog.component";

@Component({
  selector: 'personal-dashboard',
  styleUrls: ['./personal-dashboard.component.scss'],
  templateUrl: './personal-dashboard.component.html',
})
export class PersonalDashboardComponent implements OnInit {

  //search query
  public query: string;

  //result from query
  public results: Search[] = [];
  //alerts
  public alerts: AlertDTO[] = [];
  //map of alert and alertsList
  public alertsMap: Map<string, Search[]> = new Map();

  //latest alert i must highlight it
  public latestAlertIdMap: Map<string, string> = new Map();

  //cahced search response
  public response: SearchScheduleResponseDTO;
  //user logged in
  private _profile: Profile;


  public dateFilter: FormControl = new FormControl(new Date());

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: NbSearchService,
              private _searchGateway: SearchService,
              private _sessionService: SessionService,
              private _toastrService: NbToastrService,
              private _oauthService: AuthConfigService,
              private _httpService: HttpService,
              private _profileService: AuthConfigService,
              private _breachService: BreachService,
              private _dialogService: NbDialogService
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
        this.alerts = alerts as AlertDTO[];
      });

      //retrieve latest alert
      this._sessionService.getLatestAlertObservable().subscribe((latest: Map<string, string>) => {
        this.latestAlertIdMap = latest;
        for (let query of latest.keys()) {
          this._sessionService.getAlertList(this._profile.userId, query).subscribe((response: SearchScheduleResponseDTO) => {
            this.alertsMap.set(query, response.results);
          });
        }
      });
    });
  }


  public filter(): void {
    let command: SearchCommand = new SearchCommand();
    let filterItem = this.dateFilter.value;
    command.query = this.query;
    if (filterItem) {
      command.fromDate = filterItem.start ? filterItem.start.getTime() / 1000 : null;
      command.toDate = filterItem.end ? filterItem.end.getTime() / 1000 : null;
    }
    this._searchGateway.search(command).subscribe((result) => {
      this.results = result.results;
    });
  }

  /**
   * get last 5 alerts for that query
   * */
  public getAlerts(query: string): void {
    this._sessionService.getAlertList(this._profile.userId, query).subscribe((response: SearchScheduleResponseDTO) => {
      this.alertsMap.set(query, response.results);
    });
  }


  /**
   * Check if dump exist, and if exist returns  shows a dialog with dump content grepped on the query
   * */
  public download(searchItem: Search) {
    //se è un url lo apro
    if (searchItem.title.startsWith("http")) {
      window.open(searchItem.title, "_blank");
      //se non è un url faccio richiesta a telegram
    } else {
      //se è il percorso ad un file prendo solo il nome del file
      let title = searchItem.title;
      if (searchItem.title.includes("/")) {
        let array = searchItem.title.split("/");
        title = array[(array.length - 1)];
      }
      this._breachService.exists(title).subscribe((data: DumpExistsResponse) => {
        if (data.exists) {
          this._breachService.download(title, this.query).subscribe((data: BreachDTO) => {
            console.log(data);
            let greppedStr = '';
            for(let grep of data.results){
              greppedStr+=grep+"\n";
            }
            this._dialogService.open(GenericDialogComponent, {
              context: {
                title: `Data grepped from ${searchItem.title}`,
                description: greppedStr
              }
            });
          });
        } else {
          this._dialogService.open(GenericDialogComponent, {
            context: {
              title: `Dump non trovato`,
              description: `Non è stato possibile trovare il dump: ${title} in chiaro`
            }
          });
        }
      });
    }
  }

  //create searchCommand and execute the search
  private _makeSearch = (query: string): void => {
    let searchCommand: SearchCommand = new SearchCommand();
    searchCommand.query = query;
    this.query = query;
    this._searchGateway.search(searchCommand).subscribe((response: SearchScheduleResponseDTO) => {
      //generare i rettangoli per ogni risposta
      this.response = response;
      this.results = response.results;
    });
  }

  //crea un nuovo alert per l'utente
  public createAlert = (): void => {
    let searchCommand: ScheduleCommand = new ScheduleCommand();
    searchCommand.query = this.query;
    this._sessionService.createAlert(this._profile.userId, {query: this.query}).subscribe();
  }


}
