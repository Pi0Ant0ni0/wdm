import {Component, OnInit} from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {Router} from "@angular/router";
import {SearchService} from "../../api/services/search.service";
import {QueryOccurancy} from "../../api/model/search.model";
import {ChartData} from "../../infrastructure/charts/echarts/echarts-pie.component";

@Component({
  selector: 'global-dashboard',
  templateUrl: './global-dashboard.component.html',
})
export class GlobalDashboardComponent implements OnInit{

  public legend:string[]=[];
  public data:ChartData[]=[];

  //result from query
  public result: QueryOccurancy[] = [];


  constructor(private _searchService:NbSearchService,
              private _searchGateway: SearchService,
              private _router:Router) {
    this._searchService.onSearchSubmit().subscribe((result)=>{
      let param ={ search:result.term};
      this._router.navigate(["/pages/personal"],{queryParams:param});
    });

  }

  ngOnInit(): void {
    this._searchGateway.history().subscribe(response=> {
      this.legend = response.results.map(q=>q.query);
      this.data = response.results.map(q=>new ChartData(q.query, q.occurancy))
    });
  }




}
