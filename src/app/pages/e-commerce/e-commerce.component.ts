import { Component } from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {Router} from "@angular/router";
import {SearchService} from "../api/services/search.service";
import {HistoryResponseDTO, Query} from "../api/model/search.model";
import {Observable, of} from "rxjs";

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {

  //result from query
  public result: Query[] = [];

  constructor(private _searchService:NbSearchService,
              private _searchGateway: SearchService,
              private _router:Router) {
    this._searchService.onSearchSubmit().subscribe((result)=>{
      let param ={ search:result.term};
      this._router.navigate(["/pages/personale"],{queryParams:param});
    });
  }

  ngOnInit(): void {

  }


  //just for test purpose
  private _mockupHistory = (): Observable<HistoryResponseDTO> => {
    let dto: HistoryResponseDTO = {
      result: [
        {
          title: "Achille",
          value: 4,
        },
        {
          title: "Pio",
          value: 6,
        },
        {
          title: "Ermanno",
          value: 2,
        },
      ],
    };
    return of(dto);
  }


}
