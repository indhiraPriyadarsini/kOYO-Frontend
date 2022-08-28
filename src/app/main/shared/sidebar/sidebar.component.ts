import { Component, OnInit,EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  constructor(private dashboard:DashboardService,private route: ActivatedRoute,private router:Router) { }

  opensidebar:boolean=false;
  openside:any=false;
  navigateroute(event:any) {
  this.dashboard.changerouting(event.target.innerText);
  }
  sidebarDetails:any;
  Dashboard:any=["Upcoming Drives","Past Drives"];
  interview:any=["Drive Details","Validate CSV Data","Plan Rounds","Review and Finish"];
  circle:any;
  ngOnInit(): void {
    if(this.router.url=="/pages/interview-creation") {
      this.sidebarDetails=this.interview;
      this.circle=true;
    }else {
      this.sidebarDetails=this.Dashboard;
      this.circle=false;
    }


  }

}