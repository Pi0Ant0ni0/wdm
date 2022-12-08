import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../infrastructure/@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './personal-dashboard/dashboard.module';
import { GlobalDashboardModule } from './global-dashboard/global-dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import {SearchService} from "../api/services/search.service";
import {HttpService} from "../infrastructure/base-service/http.service";
import {JwtInterceptor} from "../infrastructure/auth-service/jwt-token-interceptor.service";
import {SessionService} from "../api/services/session.service";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    GlobalDashboardModule,

  ],
  declarations: [
    PagesComponent,
  ],
  providers:[
    SearchService,
    HttpService,
    JwtInterceptor,
    SessionService,
  ],
  exports:[
  ]
})
export class PagesModule {
}
