export class SearchScheduleResponseDTO{
  public timestamp:Date;
  public query:string;
  public result:Search[];
}

export class Search{
  public title:string;
  public date:Date;
  public media:string;
  public category:string;
}

export class SearchScheduleCommand{
  public query:string;
}
