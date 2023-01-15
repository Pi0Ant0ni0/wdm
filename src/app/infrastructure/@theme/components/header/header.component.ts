import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbMenuBag,
  NbMenuService, NbSearchService,
  NbSidebarService,
  NbThemeService, NbToastrService
} from '@nebular/theme';

import {LayoutService} from '../../../@core/utils';
import {Subject} from 'rxjs';
import {AlertDTO, SessionDTO, Token} from "../../../../api/model/session.model";
import {Router} from "@angular/router";
import {Profile} from "../../../auth-service/auth-model/auth.model";
import {AuthConfigService} from "../../../auth-service/auth-config.service";
import {GenericDialogComponent} from "./user-details/generic-dialog.component";
import {SessionService} from "../../../../api/services/session.service";
import {IntelxTokenDialogComponent} from "./intelx-token-dialog/intelx-token-dialog.component";
import * as mqtt from 'mqtt/dist/mqtt.min'
import {environment} from "../../../../../environments/environment";
import {MqttAlert} from "../../../../api/model/Mqtt.model";
import {EditAlertDialogComponent} from "./edit-alert-dialog/edit-alert-dialog.component";


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})


export class HeaderComponent implements OnInit, OnDestroy {


  private destroy$: Subject<void> = new Subject<void>();
  /**
   * user logged in
   * */
  public profile: Profile;
  /**
   * current session
   * */
  private _session: SessionDTO;
  /**
   * List of thees that can be chosen by the user
   * */
  public themes = [
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
  ];

  /**
   * theme chosen by the user
   * */
  public currentTheme = 'dark';


  public userMenu = [{title: 'Profile'}, {title: 'Log out'}];
  /**
   * Set notification un dumbel action
   * */
  public newAlert: boolean = false;
  /**
   * All alerts configured by the user
   * */
  public alerts: AlertDTO[] = [];

  /**
   *
   * Map between query and mqqtMessage
   */
  public latestAlert: Map<string, string> = new Map();

  /**
   * IntelxToken
   * */
  private _token: string;

  /**
   * client mqtt
   * */
  private mqttClient: mqtt.MqttClient;


  constructor(private sidebarService: NbSidebarService,
              private _menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private _toastrService: NbToastrService,
              private _router: Router,
              private _authService: AuthConfigService,
              private _dialogService: NbDialogService,
              private _sessionService: SessionService,
              private _searchService: NbSearchService
  ) {

  }

  ngOnInit() {
    /**
     * get user profile in order to load all the page
     * */
    this._authService.profile.subscribe((profile: Profile) => {

      //creating mqtt connection
      let _MQTTOptions: mqtt.IClientOptions = {
        username: environment.username,
        password: environment.password,
        resubscribe: true,
        clientId: profile.email,
        connectTimeout: environment.connectTimeout
      }
      this.mqttClient = mqtt.connect(`wss://${environment.mqttHostName}:8884/mqtt`, _MQTTOptions)
      this.mqttClient.on('message', (topic, message) => {
        // message is Buffer
        let notification: MqttAlert = {
          id: JSON.parse(message.toString()).id,
          query: JSON.parse(message.toString()).query,
        }
        this._showToast("Nuovo breach", "Alert: " + notification.query);
        this.newAlert = true;
        this.latestAlert.set(notification.query, notification.id);
        this._sessionService.emitLatestAlertsMap(this.latestAlert);
      });

      //get logged user
      this.profile = profile;

      /**
       * only admin can edit token
       * */
      if (this.profile && this.profile.role && this.profile.role == "admin") {
        this.userMenu.push({title: 'Token IntelX'});
      }

      //set default theme
      this.themeService.changeTheme("dark");
      this.currentTheme = this.themeService.currentTheme;
      //subscribe to theme change to update session
      this.themeService.onThemeChange().subscribe((themeName) => {
        if (this._session && this._session.theme && themeName) {
          if (this._session.theme != themeName.name) {
            this.currentTheme = themeName.name;
            //update current session
            this._sessionService.updateSession(this.profile.userId, {theme: this.currentTheme}).subscribe(() => {
              this._sessionService.getSession(this.profile.userId).subscribe((session) => {
                this._session = session;
              });
            });
          }
        }
      });
      this._sessionService.getToken().subscribe((token: Token) => {
        if (token && token.token && token.token.length > 0) {
          this._token = token.token;
        }
      });
      /**
       * subscribing to logout event, when is clicked trigger logout
       * subscribing to profile event when is clicked show a dialog with profile data
       * */
      this._menuService.onItemClick().subscribe((result: NbMenuBag) => {
        if (result.item) {
          switch (result.item.title) {
            /**
             * open dialog with user details
             * */
            case "Profile":
              this._dialogService.open(GenericDialogComponent, {
                context: {
                  title: 'Dettaglio Utente',
                  description: `
              <b>Nome:</b> ${this.profile.name}<br>
              <b>Cognome:</b> ${this.profile.surname}<br>
              <b>Email:</b> ${this.profile.email}<br>
              <b>Ruolo:</b> ${this.profile.role}<br>
              `
                },
              });
              break;
            /**
             * log out
             * */
            case "Log out":
              this._authService.logout();
              break;
            /**
             * open dialog to update token
             * if token has been update refresh session item
             * */
            case "Token IntelX":
              this._dialogService.open(IntelxTokenDialogComponent, {
                context: {
                  title: 'Token Intelx',
                  description: this._token,
                  userId: this.profile.userId
                },
              }).onClose.subscribe((hasUpdatedToken: boolean) => {
                if (hasUpdatedToken) {
                  this._sessionService.getToken().subscribe((token: Token) => {
                    this._token = token.token;
                  });
                }
              });
          }
        }
      });
      this._sessionService.getSession(this.profile.userId).subscribe(
        (session: SessionDTO) => {
          this._session = session;
          this.alerts = session.alertDTOs;
          //update theme
          this.changeTheme(session.theme);
          //subscribe to alert topic
          if (this.alerts) {
            this.alerts.forEach(a => {
              this.mqttClient.subscribe(`unisannio/DWM/alert/${a.query}`);
            });
          }

        },
        (error) => {
          console.log("no session found for ", this.profile.userId, " creating new session. Error: ", error);
          this._sessionService.create(this.profile.userId, {theme: "dark", userId: this.profile.userId})
            .subscribe((sessionCreated) => this._session = sessionCreated)
        });
      this._sessionService.getCurrentAlertsObservable().subscribe((alert) => {
        this.alerts = alert as AlertDTO[];
        this.alerts.forEach(a => {
          this.mqttClient.subscribe(`unisannio/DWM/alert/${a.query}`);
        });
      })

    });
  }

  public editAlerts() {
    this._dialogService.open(EditAlertDialogComponent).onClose.subscribe((alertsToDelete: string[]) => {
      for (let alertToDelete of alertsToDelete) {
        this.mqttClient.unsubscribe(`unisannio/DWM/alert/${alertToDelete}`)
      }
      this._sessionService.getSession(this.profile.userId).subscribe();
    })
  }

  private _showToast(title: string, body: string) {
    const config = {
      status: "warning",
      destroyByClick: true,
      duration: 0,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
      icon: {icon: "bell-outline", pack: 'eva'}
    };

    this._toastrService.show(
      body,
      title,
      config);
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
    this.currentTheme = this.themeService.currentTheme;
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this._menuService.navigateHome();
    return false;
  }


}
