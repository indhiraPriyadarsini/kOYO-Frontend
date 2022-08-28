import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { InterviewService } from './interview.service';

@Injectable({
	providedIn: 'root',
})
export class RoundsPlannerService {
	selectedRounds: any;
	Token: any;
	templateId=""
	constructor(private http: HttpClient,private roundService:InterviewService) {
		this.Token = sessionStorage.getItem('token');
	}

	getTemplates() {
		const headers = {
			Authorization: this.Token,
		};
		return this.http.get(
			environment.api + API_URLS.TEMPLATE + API_URLS.GETALL,
			{ headers }
		);
	}
	getRounds(templateId: any) {
		const headers = {
			Authorization: this.Token,
		};
		const params = new HttpParams().append('templateId', templateId);
		return this.http.get(
			environment.api + API_URLS.TEMPLATE + API_URLS.GET_ROUND_NAME,
			{ headers, params }
		);
	}

	getCandidates() {
		let driveId=this.roundService.getInterviewID();
		const headers = {
			"Authorization":this.Token
				};
		return this.http.get(
			environment.api + 'candidate/interview?id=' + driveId,
			{ headers }
		);
	}
	setTemplateId(templateId:any){
		this.templateId=templateId
	}
	getTemplateId():any{
		return this.templateId
	}
}
