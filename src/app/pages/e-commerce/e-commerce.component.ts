import { Component } from '@angular/core';
import {NbSearchService} from "@nebular/theme";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {

  constructor(private _searchService:NbSearchService, private _router:Router) {
    this._searchService.onSearchSubmit().subscribe((result)=>{
      let param ={ search:result.term};
      this._router.navigate(["/pages/personale"],{queryParams:param});
    });
  }
}
