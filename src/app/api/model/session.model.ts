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
  public alertDTOs: AlertDTO[];
  public theme: string;
}

/**
 * quando creiamo la session abbiamo a disposizione solo
 * il tema corrente e lo user id
 * */
export class CreateSessionCommand{
  public theme:string;
  public userId:string;
}


/**
 * command used to change theme
 * Field are not compulsary it depends on what you need to update
 * */
export class UpdateSessionCommand{
  public theme?:string;
}


/**
 * Token IntelX
 * */
export class Token{
  public token:string;
}






