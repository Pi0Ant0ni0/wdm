import { NgModule } from '@angular/core';
import {
    NbButtonModule,
    NbUserModule,
    NbIconModule, NbAccordionModule, NbDatepickerModule, NbCalendarRangeModule, NbInputModule, NbLayoutModule
} from '@nebular/theme';
import { PersonalDashboardComponent } from './personal-dashboard.component';
import {SearchService} from "../../api/services/search.service";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    imports: [
        NbUserModule,
        NbButtonModule,
        NbIconModule,
        NbAccordionModule,
        CommonModule,
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
  ]
})
export class DashboardModule { }
