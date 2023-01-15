import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../infrastructure/@theme/theme.module';
import { GlobalDashboardComponent } from './global-dashboard.component';
import { ChartModule } from 'angular2-chartjs';
import {SmartTableComponent} from "./smart-table/smart-table.component";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {ChartsModule} from "../../infrastructure/charts/charts.module";

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    Ng2SmartTableModule,
    ChartsModule,
  ],
  declarations: [
    GlobalDashboardComponent,
    SmartTableComponent
  ],
  providers: [
  ],
})
export class GlobalDashboardModule { }
