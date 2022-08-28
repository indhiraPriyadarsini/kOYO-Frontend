import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewerService {
Token:any;
  constructor(
    private http: HttpClient
  ) { 
    this.Token = sessionStorage.getItem("token");
  }
  getAllInterviewers(){
    const headers = { Authorization: this.Token };
    return this.http.get(environment.api+API_URLS.INTERVIEWER+API_URLS.GETALL,{headers});
  }
  addSingleInterviewers(data:any){
    const headers = { Authorization: this.Token };
    return this.http.post<any>(environment.api+API_URLS.INTERVIEWER+API_URLS.INSERT,{data},{headers});
  }
}
