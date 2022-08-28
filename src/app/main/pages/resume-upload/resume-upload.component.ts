import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResumeUploadService } from '@services/resume-upload/resume-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-resume-upload',
	templateUrl: './resume-upload.component.html',
	styleUrls: ['./resume-upload.component.scss'],
})
export class ResumeUploadComponent implements OnInit {
	constructor(
		private rs: ResumeUploadService,
		private toast: ToastrService,
		private route: ActivatedRoute,
		private spinner: NgxSpinnerService
	) {}

	file?: File;
	isHovered: boolean = false;
	error: string = '';
	uploadedFileInBase64: string;
	url: string;

	dataURItoBlob(dataURI: string) {
		var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], { type: mime });
	}

	getUrl() {
		return URL.createObjectURL(this.dataURItoBlob(this.uploadedFileInBase64));
	}

	ngOnInit(): void {}

	updateFile(file: File) {
		this.file = file;
		this.rs
			.convertToBase64(this.file)
			.then((val) => (this.uploadedFileInBase64 = val));
	}

	updateHovered(isHovered: boolean) {
		this.isHovered = isHovered;
	}

	updateError(error: string) {
		this.error = error;
	}

	submit(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.spinner.show();
		this.rs
			.uploadResume({
				candidateId: '861',
				fileData: this.uploadedFileInBase64.split(',')[1],
			})
			.subscribe(
				({ Data }: any) => {
					this.url = Data.Location;
					// this.toast.info('click on file to view');
					this.rs
						.uploadResumeLinkToDB({
							candidateId: this.route.snapshot.params.candidateId,
							resumeLink: Data.Location,
						})
						.subscribe(
							(val: any) => {
								this.toast.success('uploaded successfully');
								this.toast.info('click on file name to view');
								this.spinner.hide();
								this.url = val.Data.resume_link;
							},
							(err) => {
								console.log(err);
								this.toast.error('try after sometime');
								this.spinner.hide();
							}
						);
				},
				(err) => {
					console.log(err);
					this.toast.error('try after sometime');
					this.spinner.hide();
				}
			);
	}

	async handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		if (file.size > 3000000) this.error = 'file size must be less than 3MB';
		else this.error = '';
		this.updateFile(file);
	}
}
