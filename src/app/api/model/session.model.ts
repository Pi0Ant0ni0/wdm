/**
 * an alert configured by the user
 * */
export class AlertDTO{
  //query of alert
  public query:string;
  //date where alert has been added
  public alertDate:Date;
}

/**
 * Session of a user
 * it contains alert configured by the user
 * and the theme choosen
 * */
export class SessionDTO{
  public alerts: AlertDTO[];
  public theme: string;
}


/**
 * command used to change theme
 * */
export class UpdateSessionCommand{
  public theme:string;
}






