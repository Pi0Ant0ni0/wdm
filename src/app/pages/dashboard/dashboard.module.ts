import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbUserModule,
  NbIconModule, NbAccordionModule,
} from '@nebular/theme';
import { DashboardComponent } from './dashboard.component';
import {SearchService} from "../api/services/search.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "../../infrastructure/template-components/forms/forms.module";

@NgModule({
  imports: [
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbAccordionModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    DashboardComponent,

  ],
  providers:[
    SearchService
  ]
})
export class DashboardModule { }
