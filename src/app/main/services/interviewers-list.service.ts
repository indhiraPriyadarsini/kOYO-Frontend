import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewersListService {
  Token: any;
  constructor(
    private http: HttpClient
  ) { 
    this.Token = sessionStorage.getItem("token");
  }

  getInterviewers(){
    const headers = { 'Authorization':this.Token};
    return this.http.get<any>(environment.api + API_URLS.INTERVIEWER + API_URLS.GETALL, { headers });
  }

  addInterviewers(data: any){
    const headers = { 'Authorization':this.Token};
    return this.http.post<any>(environment.api + API_URLS.INTERVIEWER + API_URLS.MULTIPLEINSERT,{
      data: data
    } ,{ headers });
  }

  addSingleInterviewer(data:any){
    const headers = { Authorization: this.Token };
    return this.http.post<any>(environment.api+API_URLS.INTERVIEWER+API_URLS.INSERT,{
      data : {
        interviewerName : data.interviewerName,
        mobileNumber : data.mobileNumber,
        email : data.email,
        meetingURL: data.meetingURL,
        category: data.category,
        slackId: data.slack_id,
        role: "shbchas"
      }
    },{headers});
  }

  updateInterviewer(data: any){
    const headers = { 'Authorization':this.Token};
    return this.http.put<any>(environment.api + API_URLS.INTERVIEWER + API_URLS.UPDATE,{
      data: data
    } ,{ headers });
  }

  deleteInterviewer(id: any){
    const headers = { 'Authorization':this.Token};
    return this.http.delete<any>(environment.api + API_URLS.INTERVIEWER + API_URLS.DELETE + '?id=' +id,{ headers });
  }
}
