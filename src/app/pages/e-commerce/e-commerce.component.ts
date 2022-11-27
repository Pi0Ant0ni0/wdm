import { Component } from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {Router} from "@angular/router";
import {SearchService} from "../api/services/search.service";
import {HistoryResponseDTO, QueryOccurancy} from "../api/model/search.model";
import {Observable, of} from "rxjs";

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {

  //result from query
  public result: QueryOccurancy[] = [];

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
          query: "Achille",
          occurancy: 4,
        },
        {
          query: "Pio",
          occurancy: 6,
        },
        {
          query: "Ermanno",
          occurancy: 2,
        },
      ],
    };
    return of(dto);
  }


}
