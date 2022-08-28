import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import { HTTPResponse } from 'src/app/core/constants/schema';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root',
})
export class InterviewService {
	CSVFileDatas: any;
	csvFileName: any;
	driveName: any;
	driveForView: any;
	interviewID: any;
	fileName: any;
	fileNames: any = [];
	fileDatas: any = [];
	Token: any;
	fromDate:any;
	toDate:any;
	constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
		this.Token = sessionStorage.getItem('token');
	}
	setInterviewID(ID: any) {
		this.interviewID = ID;
	}
	getInterviewID() {
		return this.interviewID;
	}
	setDrivename(name: any) {
		this.driveForView = name;
	}
	setFileDatas(data: any) {
		this.fileNames.push(data.fileName);
		this.fileDatas.push(data.fileData);
	}
	getCandidatesData() {
		const headers = {
			Authorization: this.Token,
		};
		let data = {
			drivename: this.driveName,
			filename: this.csvFileName,
		};
		return this.http.post(
			environment.api + API_URLS.S3 + API_URLS.GET_CSV_DATA,
			{ data },
			{ headers }
		);
	}
	addCandidatesData(datas: any) {
		const headers = {
			Authorization: this.Token,
		};
		const dataa = {
			candidateDetails: datas,
			interviewId: this.getInterviewID(),
		};
		return this.http.post(
			environment.api + API_URLS.CANDIDATE_URL + API_URLS.INSERT,
			{
				data: dataa,
			},
			{ headers }
		);
	}
	fileDataApiCall(data: any) {
		this.csvFileName = data.filenames[0];
		const headers = {
			Authorization: this.Token,
		};
		return this.http.post<any>(
			environment.api + API_URLS.S3 + API_URLS.S3_UPLOAD,
			{ data },
			{ headers }
		);
	}
	setFromAndToDate(from:any,to:any){
		this.fromDate=from;
		this.toDate=to;
	}
	inputDataApiCall(value: any) {
		this.driveName = value.driveName;
		this.setFromAndToDate(value.driveDateFrom,value.driveDateTo)
		const headers = {
			Authorization: this.Token,
		};
		let data = {
			interviewName: value.driveName,
			collegeName: value.collegeName,
			collegeSpocName: value.placementCoordinator,
			collegeSpocEmail: value.placementEmail,
			startDate: new Date(value.driveDateFrom).toISOString(),
			endDate: new Date(value.driveDateTo).toISOString(),
			admin: 'gk',
			moderator: value.presidioMod,
			collegeAddress: value.collegeAddres,
		};
		return this.http.post<any>(
			environment.api + API_URLS.INTERVIEW_URL + API_URLS.INSERT,
			{ data },
			{ headers }
		);
	}

	getDriveDetails() {
		this.spinner.show();
		const headers = { Authorization: this.Token };
		const interviewId = this.getInterviewID();
		return this.http.get(environment.api + '/interview/get?id=' + interviewId, {
			headers,
		});
	}

	getSelectedCandidates(roundId: number) {
		const headers = { Authorization: this.Token };
		return this.http.get(
			environment.api + 'performance/selectedCandidate?roundId=' + roundId,
			{
				headers,
			}
		) as Observable<HTTPResponse<{ candidate_id: number }[]>>;
	}

	getCandidate(candidateId: number) {
		const headers = { Authorization: this.Token };
		return this.http
			.get(
				environment.api + API_URLS.CANDIDATE_URL + `/get?id=${candidateId}`,
				{ headers }
			)
			.pipe(catchError((err) => of(err))) as Observable<HTTPResponse<any>>;
	}
	getDriveDetailsView(id: any) {
		const headers = { Authorization: this.Token };
		return this.http.get(environment.api + '/interview/get?id=' + id, {
			headers,
		});
	}

	updateDriveDetails(value: any) {
		const headers = { Authorization: this.Token };
		return this.http.put(
			environment.api + API_URLS.INTERVIEW_URL + API_URLS.UPDATE,
			{
				data: {
					interviewName: value.driveName,
					collegeName: value.collegeName,
					collegeSpocName: value.placementCoordinator,
					collegeSpocEmail: value.placementEmail,
					startDate: new Date(value.driveDateFrom).toISOString(),
					endDate: new Date(value.driveDateTo).toISOString(),
					admin: 'gk',
					moderator: value.presidioMod,
					collegeAddress: value.collegeAddres,
					interviewId: parseInt(value.interviewId),
				},
			},
			{ headers }
		);
	}

	getCandidatesView(id: any) {
		const headers = { Authorization: this.Token };
		return this.http.get(
			environment.api +
				API_URLS.CANDIDATE_URL +
				'/' +
				API_URLS.INTERVIEW_URL +
				'?id=' +
				id,
			{ headers }
		);
	}

	getFileDetails() {
		const headers = { Authorization: this.Token };
		return this.http.post(
			environment.api + API_URLS.S3 + API_URLS.GET_FILENAMES,
			{
				data: {
					drivename: this.driveForView,
				},
			},
			{ headers }
		);
	}

	getFile(name: any) {
		const headers = { Authorization: this.Token };
		return this.http.post(
			environment.api + API_URLS.S3 + API_URLS.DOWNLOADFILE,
			{
				data: {
					drivename: this.driveForView,
					filename: name,
				},
			},
			{ headers }
		);
	}

	updateCandidate(data: any) {
		const headers = { Authorization: this.Token };
		return this.http.put(
			environment.api + API_URLS.CANDIDATE_URL + API_URLS.UPDATE,
			{
				data: {
					interviewId: parseInt(data.driveId),
					firstName: data.firstName,
					lastName: data.lastName,
					registerNumber: data.registerNumber,
					department: data.department,
					email: data.email,
					githubLink: data.githubLink,
					mobileNumber: data.mobileNumber,
					candidateId: parseInt(data.candidateId),
				},
			},
			{ headers }
		);
	}

	deleteCandidate(id: any) {
		const headers = { Authorization: this.Token };
		return this.http.delete(
			environment.api + API_URLS.CANDIDATE_URL + API_URLS.DELETE + '?id=' + id,
			{ headers }
		);
	}

	getPanelData(roundId: number) {
		const headers = { Authorization: this.Token };
		return this.http
			.get(
				environment.api +
					API_URLS.PANEL +
					API_URLS.GET_ROUND +
					`?roundId=${roundId}
				`,
				{ headers }
			)
			.pipe(catchError((err) => of(err))) as Observable<HTTPResponse<any>>;
	}

	getSlotData(panelId: number) {
		const headers = { Authorization: this.Token };
		return this.http
			.get(
				environment.api +
					API_URLS.SLOT +
					API_URLS.GET_PANEL +
					`?panelId=${panelId}
				`,
				{ headers }
			)
			.pipe(catchError((err) => of(err))) as Observable<HTTPResponse<any>>;
	}
}
