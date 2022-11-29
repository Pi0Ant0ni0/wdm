import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() title: string;
  @Input() description:string;

  constructor(protected ref: NbDialogRef<UserDetailsComponent>) {}

  dismiss() {
    this.ref.close();
  }

  ngOnInit(): void {
  }

}
