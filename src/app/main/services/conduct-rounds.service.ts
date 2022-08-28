import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConductRoundsService {
  token :any;

  constructor(private http: HttpClient) {
    this.token=sessionStorage.getItem("token");
  }

  getAllData(data:any){
    const headers = { 'Authorization':this.token};
    return this.http.post<any>(environment.api + API_URLS.PERFORMANCE +API_URLS.GET_CONDUCT_ROUNDS, { data:data }, { headers });
  }
  getRounds(ID:any){
    const headers = { 'Authorization':this.token};
    return this.http.get<any>(environment.api + API_URLS.GET_INTERVIEW+"?id="+ID, { headers });
  }
}
