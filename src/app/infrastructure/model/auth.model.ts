export class Profile{
  public name:string;
  public email:string;
  public surname:string;
  public userId:string;
  public role:string;
}

export class UpdateProfileCommand{
  public name:string;
  public surname:string;
  public email:string;
}
