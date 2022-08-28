import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewAndFinishService {
  Token: any;
  constructor(
    private http: HttpClient
  ) { 
    this.Token = sessionStorage.getItem("token");
  }

  createDrive(data: any){
    const headers = { Authorization: this.Token };
        return this.http.post(environment.api+API_URLS.FINISHANDREVIEW, {
          data : data
         }, {headers});
  }
}
