import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisqualifyService {

  Token:any;
  constructor(
    private http: HttpClient
  ) { 
    this.Token=sessionStorage.getItem("token");
  }

  getAll() {
    const authorization={
      "Authorization":this.Token
    }
      return this.http.get(environment.api+"performance/disqualifiedCandidate?interviewId=281", {
      headers:authorization
    })
  }


  getcandidateform() {
    const authorization={
      "Authorization":this.Token
    }
      return this.http.get(environment.api+"candidate/getprofile?interviewId=281&interviewerId=15", {

    });
    header:authorization
  }

  updateCandidateForm(data:any) {
    const authorization={
      "Authorization":this.Token
    }
    return this.http.put<any>("https://jthmzl8g9e.execute-api.us-east-1.amazonaws.com/Stage/performance/update", { data }, { headers:authorization });
  }

}