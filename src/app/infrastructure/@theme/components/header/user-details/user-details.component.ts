import {Component, Input} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent{

  /**
   * title of dialog
   * */
  @Input() public title: string;
  /**
   * content of dialog
   * */
  @Input() public description:string;

  /**
   * inject reference to dialog
   * */
  constructor(protected ref: NbDialogRef<UserDetailsComponent>) {}

  /**
   * callback to close the dialog
   * mapped to a dialog dismiss button
   * */
  public dismiss() {
    this.ref.close();
  }


}
