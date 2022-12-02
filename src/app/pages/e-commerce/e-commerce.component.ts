import { Component } from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {Router} from "@angular/router";
import {SearchService} from "../../api/services/search.service";
import {HistoryResponseDTO, QueryOccurancy} from "../../api/model/search.model";
import {Observable, of} from "rxjs";
import {ChartData} from "../../infrastructure/template-components/charts/echarts/echarts-pie.component";

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {

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
    this._mockupHistory().subscribe(response=> {
      this.legend = response.result.map(q=>q.query);
      this.data = response.result.map(q=>new ChartData(q.query, q.occurancy))
    });
  }


  //just for test purpose
  private _mockupHistory = (): Observable<HistoryResponseDTO> => {
    let dto: HistoryResponseDTO = {
      result: [
        {
          query: "unisannio.it",
          occurancy: 4,
        },
        {
          query: "google.it",
          occurancy: 6,
        },
        {
          query: "vatican.va",
          occurancy: 2,
        },
        {
          query: "aranzulla.it",
          occurancy: 4,
        },
        {
          query: "twitter.com",
          occurancy: 1,
        },
      ],
    };
    return of(dto);
  }


}
