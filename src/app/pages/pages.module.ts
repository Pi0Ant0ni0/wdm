import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../infrastructure/@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from '../infrastructure/template-components/miscellaneous/miscellaneous.module';
import {SearchService} from "../api/services/search.service";
import {HttpService} from "../infrastructure/base-service/http.service";
import {JwtInterceptor} from "../infrastructure/auth-service/jwt-token-interceptor.service";
import {SessionService} from "../api/services/session.service";
import {FormsModule} from "../infrastructure/template-components/forms/forms.module";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    FormsModule
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
    FormsModule
  ]
})
export class PagesModule {
}
