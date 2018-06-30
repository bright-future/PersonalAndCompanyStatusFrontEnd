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
    this.getUserDetails();
  }

  getUserDetails(): void{
    this.userDetails = this.userDetailService.getDetails()
      .subscribe(userDetails => this.userDetails = userDetails);
  }
}
