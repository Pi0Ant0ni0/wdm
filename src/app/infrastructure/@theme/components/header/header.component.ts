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
import {map, takeUntil} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {AlertDTO} from "../../../../pages/api/model/session.model";
import {Router} from "@angular/router";
import {Search} from "../../../../pages/api/model/search.model";
import {Profile} from "../../../auth-service/auth-model/auth.model";
import {AuthConfigService} from "../../../auth-service/auth-config.service";
import {UserDetailsComponent} from "./user-details/user-details.component";


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
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  /**
   * theme chosen by the user
   * */
  public currentTheme = 'default';


  userMenu = [{title: 'Profile'}, {title: 'Log out'}];
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
  public alertsMap: Map<string, Search[]>;

  constructor(private sidebarService: NbSidebarService,
              private _menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private _toastrService: NbToastrService,
              private _mqttService: MqttService,
              private _router: Router,
              private _authService: AuthConfigService,
              private _dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    /**
     * get user profile in order to load all the page
     * */
    this._authService.profile.subscribe((profile: Profile) => {

      this.currentTheme = this.themeService.currentTheme;
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

      this.themeService.onThemeChange()
        .pipe(
          map(({name}) => name),
          takeUntil(this.destroy$),
        )
        .subscribe(themeName => this.currentTheme = themeName);


      this._mockupAlerts("userId").subscribe(result => {
        this.alerts = result;
        this.alerts.forEach(a => {
          this._mqttService.observe(`${a.query}`).subscribe((message: IMqttMessage) => {
            this._showToast("Nuovo breach", "Alert: " + a.query);
            this.newAlert = true;
            let search: Search = new Search(
              JSON.parse(message.payload.toString()).title,
              JSON.parse(message.payload.toString()).date,
              JSON.parse(message.payload.toString()).media,
              JSON.parse(message.payload.toString()).category,
            );

            if (this.alertsMap.get(a.query) == undefined) {
              this.alertsMap.set(a.query, []);
              this.alertsMap.get(a.query).push(search);
            } else {
              this.alertsMap.get(a.query).push(search);
            }

            //TODO Mandare notifica e mostrare nell'accordion
          });
        });

      });

    });

  }

  public resetAlertStatus() {
    this._router.navigate(["/pages/personal"]);
    this.newAlert = false;
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

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
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
