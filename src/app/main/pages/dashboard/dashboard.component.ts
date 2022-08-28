import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  upcomingdrives:any=true;
  pastdrives:any=false;
  drivedata:any;

  constructor(
    private router: Router,private dashboard: DashboardService
  ) {
  }

  openDraft(event:any) {
    this.dashboard.changerouting(event.target.innerText);
  }
  ngOnInit(): void {}
  
  navigate(){
    this.router.navigate(["pages/interview-creation"]);
    sessionStorage.removeItem('isViewing');
    sessionStorage.removeItem('driveID');
  }

}