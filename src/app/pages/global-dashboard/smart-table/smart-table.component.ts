import {Component} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';

import {SearchService} from "../../../api/services/search.service";
import {HistoryResponseDTO} from "../../../api/model/search.model";

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {

  settings = {
    actions:{
      add:false,
      delete:false,
      edit:false
    },
    columns: {
      query: {
        title: 'Query',
        type: 'string',
      },
      occurancy: {
        title: 'Occorrenze',
        type: 'number'
      }
    },
  };

  public source: LocalDataSource = new LocalDataSource();

  constructor(private searchService: SearchService) {
    this.searchService.history().subscribe((response: HistoryResponseDTO) => {
      this.source.load(response.results);
    });
  }
}
