import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { HTTPResponse } from 'src/app/core/constants/schema';
import { environment } from 'src/environments/environment';
import { PastDriveDataInterface } from '../pages/past-drive-details/past-drive-details.component';

@Injectable({
	providedIn: 'root',
})
export class DashboardService {
  pastdrives: any=false;
  upcomingdrives:any=true;
  drafts:any=false;
  routeChange: BehaviorSubject<object> = new BehaviorSubject<object>({
    pastdrives:false,
    upcomingdrives:true,
    drafts:false
  });
  Token:any;
  constructor(
    private http: HttpClient
  ) { 
    this.Token=sessionStorage.getItem("token");
  }


  getAll(data:any) {
    let a=data;
    const authorization={
      "Authorization":this.Token
    }
    return this.http.get(environment.api+API_URLS.INTERVIEW_URL+API_URLS.GETALL+"?driveType="+a, {
      headers:authorization
    })
  }

  changerouting(value: any){

      if(value=="Past Drives") {
        this.routeChange.next(
          {
            pastdrives:true,
            upcomingdrives:false,
            drafts:false
          }
        )
      }
      if(value=="Upcoming Drives") {
        this.routeChange.next(
          {
            pastdrives:false,
            upcomingdrives:true,
            drafts:false,
          }
        )
    }
    if(value=="Drafts") {
      this.routeChange.next(
        {
          drafts:true,
          pastdrives:false,
          upcomingdrives:false
        }
      )
    }
  }
  getPastDrives(driveId: string) {
		const authorization = {
			Authorization: this.Token,
		};
		return this.http.get(
			environment.api +
				API_URLS.INTERVIEW_URL +
				API_URLS.VIEW_DETAILS +
				`?id=${driveId}`,
			{ headers: authorization }
		) as Observable<HTTPResponse<PastDriveDataInterface>>;
	}
}
