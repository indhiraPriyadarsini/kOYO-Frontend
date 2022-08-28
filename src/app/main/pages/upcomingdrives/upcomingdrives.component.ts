import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { convertToTimeStamp } from 'src/app/core/helpers/timeValidator';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-upcomingdrives',
  templateUrl: './upcomingdrives.component.html',
  styleUrls: ['./upcomingdrives.component.scss']
})
export class UpcomingdrivesComponent implements OnInit {
  drivedata:any;
  drivecopy:any;
  live:any=true;
  upcomingdrives:boolean=true;
  pastdrives:boolean=false;
  drafts:boolean=false;
  LiveDrives:any=[];
  UpcomingDrives:any=[];
  title:any;
  currentDate:number=new Date().getTime();
  constructor(private dashboadService:DashboardService, private spinner: NgxSpinnerService, private router: Router) { 
    
    }
  ngOnInit(): void {
    this.dashboadService.routeChange.subscribe((value:any)=>{
      this.upcomingdrives=value.upcomingdrives;
      this.pastdrives=value.pastdrives;
      this.drafts=value.drafts;


      if(this.upcomingdrives) {
        this.title="UPCOMING DRIVES";
        this.spinner.show();
        this.dashboadService.getAll("upcoming")
        .subscribe((data:any)=> {
         this.drivedata=data.Data.map(el => ({...el,isLive : false}));
         this.drivedata.sort((a, b) => {
           if (a.start_date < b.start_date) return -1;
           else if (a.start_date > b.start_date) return 1;
           else return 0;
         });
         this.drivedata.forEach(element => {
           const startdate = new Date(element.start_date).getTime();
           const enddate = new Date(element.end_date).getTime();
           if(((this.currentDate>=startdate))&&(this.currentDate<=enddate)) {
             element.isLive=true;
           }
           if(element.isLive) {
             this.LiveDrives.push(element);
           }
           else {
             this.UpcomingDrives.push(element);
           }
           this.drivedata=this.UpcomingDrives;
         });
         this.spinner.hide();
       })
      }


      if(this.pastdrives) {
        this.title="PAST DRIVES";
        this.spinner.show();
        this.dashboadService.getAll("past")
        .subscribe((data:any)=> {
         this.drivedata=data.Data.map(el => ({...el,isLive : false}));
         this.drivedata.sort((a, b) => {
           if (b.start_date < a.start_date) return -1;
           else if (b.start_date > a.start_date) return 1;
           else return 0;
         });
         this.spinner.hide();
       })
        this.drivedata.sort((a, b) => {
          if (b.start_date < a.start_date) return -1;
          else if (b.start_date > a.start_date) return 1;
          else return 0;
        });
      }


      if(this.drafts) {
        this.title="Drafts";
        this.spinner.show();
        this.dashboadService.getAll("draft")
        .subscribe((data:any)=> {
          this.drivedata=data.Data.map(el => ({...el,isLive : false}));
         this.spinner.hide();
       })
      }

    })

    this.spinner.show();

  }

  viewDriveDetails(id: any){
    sessionStorage.setItem("isViewing", "1");
    sessionStorage.setItem("driveID", id);
    this.router.navigate(['pages/interview-creation']);
  }

}
