import { NgModule } from '@angular/core';
import {
    NbButtonModule,
    NbUserModule,
    NbIconModule, NbAccordionModule, NbDatepickerModule, NbCalendarRangeModule, NbInputModule, NbLayoutModule
} from '@nebular/theme';
import {
  MqttModule,
  IMqttServiceOptions, MqttService
} from 'ngx-mqtt';
import { PersonalDashboardComponent } from './personal-dashboard.component';
import {SearchService} from "../../api/services/search.service";
import {CommonModule} from "@angular/common";
import {environment} from "../../../environments/environment";
import {ReactiveFormsModule} from "@angular/forms";

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.mqttHostName,
  port: environment.port,
  protocol: "wss",
  clean: environment.clean, // Retain session
  connectTimeout: environment.connectTimeout, // Timeout period
  reconnectPeriod: environment.reconnectPeriod, // Reconnect period
  clientId: environment.clientId,
  path: environment.path
};


@NgModule({
    imports: [
        NbUserModule,
        NbButtonModule,
        NbIconModule,
        NbAccordionModule,
        CommonModule,
        MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
        NbDatepickerModule,
        NbCalendarRangeModule,
        NbInputModule,
        ReactiveFormsModule,
        NbLayoutModule
    ],
  declarations: [
    PersonalDashboardComponent,

  ],
  providers:[
    SearchService,
    MqttService
  ]
})
export class DashboardModule { }
