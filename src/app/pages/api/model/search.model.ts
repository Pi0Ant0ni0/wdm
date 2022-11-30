export class SearchScheduleResponseDTO{
  public timestamp:Date;
  public query:string;
  public result:Search[];
}

export class HistoryResponseDTO{
  public result:QueryOccurancy[];
}

export class QueryOccurancy{
  public query:string;
  public occurancy:number;
}

export class Search{
  public id:string;
  public title:string;
  public date:Date;
  public media:string;
  public category:string;
  public hasFile:boolean;

  constructor(id:string,title: string, date: Date, media: string, category: string) {
    this.id=id;
    this.title = title;
    this.date = date;
    this.media = media;
    this.category = category;
  }
}

export class SearchScheduleCommand{
  public query:string;
}
