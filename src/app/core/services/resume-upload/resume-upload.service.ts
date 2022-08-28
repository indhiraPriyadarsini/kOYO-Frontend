import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface PayloadInterface {
	candidateId: string;
	fileData: string;
}

interface DBUploadInterface {
	candidateId: string;
	resumeLink: string;
}

@Injectable({
	providedIn: 'root',
})
export class ResumeUploadService {
	constructor(private http: HttpClient) {}

	convertToBase64(file: File): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event: ProgressEvent<FileReader>) =>
				resolve(event.target.result as string);
		});
	}

	uploadResume(data: PayloadInterface) {
		return this.http.put(
			environment.api + 's3/uploadcandidateresume',
			{ data },
			{
				headers: {
					Authorization: sessionStorage.getItem('token'),
				},
			}
		);
	}

	uploadResumeLinkToDB(data: DBUploadInterface) {
		return this.http.post(
			environment.api + '/candidate/updateresume',
			{ data },
			{
				headers: {
					Authorization: sessionStorage.getItem('token'),
				},
			}
		);
	}
}
