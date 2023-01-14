import { Component, OnInit } from '@angular/core';
import {SessionService} from "../../../../../api/services/session.service";
import {AuthConfigService} from "../../../../auth-service/auth-config.service";
import {Profile} from "../../../../auth-service/auth-model/auth.model";
import {AlertDTO, SessionDTO} from "../../../../../api/model/session.model";
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'ngx-edit-alert-dialog',
  templateUrl: './edit-alert-dialog.component.html',
  styleUrls: ['./edit-alert-dialog.component.scss']
})
export class EditAlertDialogComponent implements OnInit {

  /**
   * Settings for smart table
   * */
  public settings = {
    columns: {
      query: {
        title: 'Alert'
      },
    },
    actions:{
      add:false,
      edit:false
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };



  public alerts:AlertDTO[]=[];
  private _profile:Profile;
  private _alertsToDelete:string[]=[];
  constructor(private _sessionService:SessionService,
              private _profileService:AuthConfigService,
              protected ref: NbDialogRef<EditAlertDialogComponent>
  ) { }

  ngOnInit(): void {
    this._profileService.profile.subscribe((profile)=>{
      this._profile=profile;
      this._sessionService.getSession(profile.userId).subscribe((sessionDTO: SessionDTO)=>{
        this.alerts=sessionDTO.alertDTOs;
      })

    });
  }


  public deleteAlert = (query:string): void => {
    this._sessionService.deleteAlert(this._profile.userId,query).subscribe(()=>{
      this._alertsToDelete.push(query);
      this._sessionService.getSession(this._profile.userId).subscribe((session:SessionDTO)=>{
        this.alerts=session.alertDTOs;
      });
    });
  }

  public close(){
    this.ref.close(this._alertsToDelete);
  }

  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.deleteAlert(event.data.query);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
