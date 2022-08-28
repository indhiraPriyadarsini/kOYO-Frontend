import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoundDetailsService {

  Token:any;
  roundsData:any=[];
  templateName="";
  constructor(private http: HttpClient) {
    this.Token = sessionStorage.getItem("token");
  }
  setRoundDetails(data:any){
      this.roundsData.push(data)
  }
  getRoundsDetails():any{
    return this.roundsData
  }
  clearRoundDetails(){
    this.roundsData=[]
  }
  setTemplateName(data:any){
    this.templateName=data
  }
  getTemplateName():any{
    return this.templateName
  }
  getAllRounds(){
    const headers = { 'Authorization':this.Token};
    return this.http.get<any>(environment.api + API_URLS.ROUND_DETAILS_URL + API_URLS.GETALL, { headers });
  }
  insertNewTemplate(data:any){
    const headers = { 'Authorization':this.Token};
    return this.http.post<any>(environment.api + API_URLS.TEMPLATE_URL + API_URLS.INSERT, { data }, { headers });
  }
  roundDetailsInsertApiCall(data: any) {
    const headers = { 'Authorization':this.Token};
    return this.http.post<any>(environment.api + API_URLS.ROUND_DETAILS_URL + API_URLS.INSERT, { data }, { headers });
  }
  templateList() {
    const headers = { 'Authorization':this.Token};
    return this.http.get<any>(environment.api + API_URLS.TEMPLATE_URL + API_URLS.GETALL, { headers });
  }
  templateUpdateApiCall(data: any) {
    const headers = { 'Authorization':this.Token};
    return this.http.put<any>(environment.api + API_URLS.TEMPLATE_URL + API_URLS.UPDATE, { data }, { headers });
  }
}
