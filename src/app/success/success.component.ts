import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'google-auth-lib';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(
    private googleService: GoogleAuthService
  ) { }

  ngOnInit() {
    this.googleService.getAccessToken();
  }

}
