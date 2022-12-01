import {QueryOccurancy} from "./search.model";

export class AlertDTO{
  public query:string;
  public alertDate:Date;
}

export class SessionDTO{
  public alerts: AlertDTO[];
  public theme: string;
}

export class sessionCommand{
  public theme:string;
}






