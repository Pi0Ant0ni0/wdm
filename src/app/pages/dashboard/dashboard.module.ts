import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbUserModule,
  NbIconModule, NbAccordionModule,
} from '@nebular/theme';
import {
  MqttModule,
  IMqttServiceOptions, MqttService
} from 'ngx-mqtt';
import { DashboardComponent } from './dashboard.component';
import {SearchService} from "../../api/services/search.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "../../infrastructure/template-components/forms/forms.module";
import {environment} from "../../../environments/environment";

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
    FormsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  declarations: [
    DashboardComponent,

  ],
  providers:[
    SearchService,
    MqttService
  ]
})
export class DashboardModule { }
