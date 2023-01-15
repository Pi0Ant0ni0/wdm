import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PersonalDashboardComponent } from './personal-dashboard/personal-dashboard.component';
import { GlobalDashboardComponent } from './global-dashboard/global-dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'global',
      component: GlobalDashboardComponent,
    },
    {
      path: 'personal',
      component: PersonalDashboardComponent,
    },
    {
      path: '',
      redirectTo: 'global',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
