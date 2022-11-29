import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbGlobalPhysicalPosition,
  NbMediaBreakpointsService, NbMenuBag,
  NbMenuService,
  NbSidebarService,
  NbThemeService, NbToastrService
} from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {AlertDTO} from "../../../../pages/api/model/session.model";
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";
import {Search} from "../../../../pages/api/model/search.model";


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = true;
  user: any;
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


  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];
  /**
   * Set notification un dumbel action
   * */
  public newAlert:boolean = true;
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
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private _toastrService:NbToastrService,
              private _mqttService:MqttService,
              private _oauthService:OAuthService,
              private _router: Router
              ) {
    this._menuService.onItemClick().subscribe((result:NbMenuBag)=>{
      if(result.item){
        if(result.item.title==this.userMenu[1].title){
          this._oauthService.logOut();
        }
      }
    });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);



    this._mockupAlerts("userId").subscribe(result => {
      this.alerts = result;
      this.alerts.forEach(a => {
        this._mqttService.observe(`${a.query}`).subscribe((message: IMqttMessage) => {
          this._showToast("Nuovo breach", "Alert: " +a.query);
          this.newAlert=true;
          let search: Search = new Search(
            JSON.parse(message.payload.toString()).title,
            JSON.parse(message.payload.toString()).date,
            JSON.parse(message.payload.toString()).media,
            JSON.parse(message.payload.toString()).category,
          );

          if(this.alertsMap.get(a.query) == undefined){
            this.alertsMap.set(a.query, []);
            this.alertsMap.get(a.query).push(search);
          }
          else{
            this.alertsMap.get(a.query).push(search);
          }

          //TODO Mandare notifica e mostrare nell'accordion
        });
      });

    });
  }

  public resetAlertStatus(){
    this._router.navigate(["/pages/personal"]);
    this.newAlert=false;
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
