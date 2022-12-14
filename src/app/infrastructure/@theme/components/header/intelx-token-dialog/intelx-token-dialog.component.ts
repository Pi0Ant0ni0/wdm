import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionService} from "../../../../../api/services/session.service";

@Component({
  selector: 'ngx-intelx-token-dialog',
  templateUrl: './intelx-token-dialog.component.html',
  styleUrls: ['./intelx-token-dialog.component.scss']
})
export class IntelxTokenDialogComponent implements OnInit{

  /**
   * title of dialog
   * */
  @Input() public title: string;
  /**
   * content of dialog
   * */
  @Input() public description:string;
  /**
   * logged user id
   * */
  @Input()public userId:string;

  public intelxForm:FormGroup;
  /**
   * inject reference to dialog
   * */
  constructor(protected ref: NbDialogRef<IntelxTokenDialogComponent>,
              private _formBuilder:FormBuilder,
              private _sessionService:SessionService) {}

  /**
   * callback to close the dialog
   * mapped to a dialog dismiss button
   * */
  public dismiss() {
    this.ref.close(false);
  }


  /**
   *callback called to update token
   * */
  public updateToken() {
    this._sessionService.updateSession(this.userId,{intelXToken:this.intelxForm.get("intelxControl").value}).subscribe(()=>{
      this.ref.close(true);
    });
  }

  ngOnInit(): void {
    this.intelxForm=this._formBuilder.group({
      intelxControl:[this.description, Validators.required]
    });
  }

}
