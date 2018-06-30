import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../services/userDetailService/user-detail.service';
import { UserDetails } from '../configFiles/UserDetails';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDetail:UserDetails;
  constructor(private userDetailService: UserDetailService) { }

  ngOnInit() {
    this.userDetail = new UserDetails();
    this.getUserDetails(this.userDetail);
  }

  getUserDetails(userDetail: UserDetails): void{
    this.userDetailService.sendUserDetails(userDetail)
      .subscribe((userDetail: UserDetails) => this.userDetail = userDetail);
  }
}
