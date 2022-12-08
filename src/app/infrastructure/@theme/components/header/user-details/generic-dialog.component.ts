import {Component, Input} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'ngx-user-details',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
export class GenericDialogComponent {

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
  constructor(protected ref: NbDialogRef<GenericDialogComponent>) {}

  /**
   * callback to close the dialog
   * mapped to a dialog dismiss button
   * */
  public dismiss() {
    this.ref.close();
  }


}
