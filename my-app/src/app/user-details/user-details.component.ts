import { Component, OnInit } from '@angular/core';
import {UserDetails} from '../configFiles/UserDetails';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetail:UserDetails;
  constructor() { }

  ngOnInit() {
    this.userDetail = new UserDetails();
  }

}
