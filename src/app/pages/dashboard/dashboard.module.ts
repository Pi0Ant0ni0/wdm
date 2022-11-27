import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbUserModule,
  NbIconModule, NbAccordionModule,
} from '@nebular/theme';
import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';
import { DashboardComponent } from './dashboard.component';
import {SearchService} from "../api/services/search.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "../../infrastructure/template-components/forms/forms.module";
import {environment} from "../../../environments/environment";

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.mqttHostName,
  port: environment.port,
  path: ''
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
    SearchService
  ]
})
export class DashboardModule { }
