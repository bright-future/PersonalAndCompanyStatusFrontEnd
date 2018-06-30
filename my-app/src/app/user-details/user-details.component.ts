import { Component, OnInit } from '@angular/core';
<<<<<<< fa99e8b0abdbe151f4971d563f277c57211c2fdd
import {UserDetails} from '../configFiles/UserDetails';
=======
import { UserDetailService } from '../services/userDetailService/user-detail.service';
import { UserDetails } from '../configFiles/UserDetails';
>>>>>>> user detail service

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
<<<<<<< fa99e8b0abdbe151f4971d563f277c57211c2fdd
  userDetail:UserDetails;
  constructor() { }

  ngOnInit() {
    this.userDetail = new UserDetails();
=======

  userDetails: UserDetails[];

  constructor(private userDetailService: UserDetailService) { }

  ngOnInit() {
    this.getUserDetails();
>>>>>>> user detail service
  }

  getUserDetails(): void{
    this.userDetails = this.userDetailService.getDetails()
      .subscribe(userDetails => this.userDetails = userDetails);
  }
}
