export class SearchScheduleResponseDTO{
  public id:string;
  public timestamp:number;
  public query:string;
  public totalResults:number;
  public results:Search[];
}

export class HistoryResponseDTO{
  public results:QueryOccurancy[];
}

export class QueryOccurancy{
  public query:string;
  public occurancy:number;
}

export class Search{
  public id:string;
  public title:string;
  public date:number;
  public media:string;
  public category:string;

  constructor(id:string,title: string, date: number, media: string, category: string) {
    this.id=id;
    this.title = title;
    this.date = date;
    this.media = media;
    this.category = category;
  }
}

export class SearchCommand{
  public query:string;
  public fromDate?:number;
  public toDate?:number;
}

export class ScheduleCommand{
  public query:string;
}
