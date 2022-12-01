import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbMenuBag,
  NbMenuService,
  NbSidebarService,
  NbThemeService, NbToastrService
} from '@nebular/theme';

import {LayoutService} from '../../../@core/utils';
import {Observable, of, Subject} from 'rxjs';
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {AlertDTO, SessionDTO, UpdateSessionCommand} from "../../../../api/model/session.model";
import {Router} from "@angular/router";
import {Profile} from "../../../auth-service/auth-model/auth.model";
import {AuthConfigService} from "../../../auth-service/auth-config.service";
import {UserDetailsComponent} from "./user-details/user-details.component";
import {HeaderService} from "./header.service";


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

  constructor(private sidebarService: NbSidebarService,
              private _menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private _toastrService: NbToastrService,
              private _mqttService: MqttService,
              private _router: Router,
              private _authService: AuthConfigService,
              private _dialogService: NbDialogService,
              private _headerService: HeaderService,
  ) {

  }

  ngOnInit() {
    /**
     * get user profile in order to load all the page
     * */
    this._authService.profile.subscribe((profile: Profile) => {

      //set default theme
      this.themeService.changeTheme("dark");
      this.currentTheme = this.themeService.currentTheme;

      //get logged user
      this.profile = profile;

      /**
       * subscribing to logout event, when is clicked trigger logout
       * subscribing to profile event when is clicked show a dialog with profile data
       * */
      this._menuService.onItemClick().subscribe((result: NbMenuBag) => {
        if (result.item) {
          if (result.item.title == this.userMenu[1].title) {
            this._authService.logout();
          }

          if (result.item.title == this.userMenu[0].title) {
            this._dialogService.open(UserDetailsComponent, {
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
          }
        }
      });

      //subscribe to theme change to update session
      this.themeService.onThemeChange().subscribe(themeName => {
        this.currentTheme = themeName;
        //update current session
        this._updateSession(this.profile.userId,{theme:this.currentTheme}).subscribe();
      });


      this._getSession("userId").subscribe(session => {
        this.alerts = session.alerts;
        //update alerts
        this._headerService.emitCurrentAlerts(this.alerts);
        //update theme
        this.changeTheme(session.theme);
        //subscribe to alert topic
        this.alerts.forEach(a => {
          this._mqttService.observe(`${a.query}`).subscribe((message: IMqttMessage) => {
            this._showToast("Nuovo breach", "Alert: " + a.query);
            this.newAlert = true;
            let notification = {
              id: JSON.parse(message.payload.toString()).id,
              query: JSON.parse(message.payload.toString()).query,
            }
            this.latestAlert.set(notification.query, notification.id);
            this._headerService.emitAlerts(this.latestAlert);
          });
        });

      });

    });

  }

  public resetAlertStatus() {
    this._router.navigate(["/pages/personal"]);
    this.newAlert = false;
  }

  private _showToast(title: string, body: string) {
    const config = {
      status: "warning",
      destroyByClick: true,
      duration: 2000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = title ? `. ${title}` : '';

    this._toastrService.show(
      body,
      `Toast ${titleContent}`,
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


  /**
   * mockup for get session operation
   * */
  private _getSession = (userId: string): Observable<SessionDTO> => {
    let dto: AlertDTO[] = [
      {
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
    ]
    let session: SessionDTO =
      {
        alerts: dto,
        theme: "cosmic",
      };
    return of(session);
  }

  /**
   * mockup for updateSession when changing theme
   * */
  private _updateSession=(userId:string, command:UpdateSessionCommand):Observable<void>=>{
    console.log("theme changed");
    return of();
  }
}
