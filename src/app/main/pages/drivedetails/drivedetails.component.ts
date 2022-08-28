import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationsService } from 'src/app/core/constants/validations.service';
import * as XLSX from 'xlsx';
import { InterviewService } from '../../services/interview.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { OrganiseRoundsService } from '../../services/organise-rounds.service';
@Component({
	selector: 'app-drivedetails',
	templateUrl: './drivedetails.component.html',
	styleUrls: ['./drivedetails.component.scss'],
})
export class DrivedetailsComponent implements OnInit {
	driveForm: any;
	excelError = false;
	errorMessage = [];
	csvDatas: any = [];
	validationResult: any = [''];
	file: any;
	date: any;
	filename = '';
	isViewing = false;
	driveId: any;
	dateError = true;
	constructor(
		public fb: FormBuilder,
		private interviewService: InterviewService,
		private route: Router,
		private validationsService: ValidationsService,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		public datepipe: DatePipe,
    private getRound : OrganiseRoundsService
	) {
		let mail = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
		this.driveForm = fb.group({
			driveName: [{ value: '', disabled: false }, [Validators.required]],
			driveDateFrom: [{ value: '', disabled: false }, [Validators.required]],
			driveDateTo: [{ value: '', disabled: false }, [Validators.required]],
			collegeName: [
				{ value: '', disabled: false },
				[Validators.minLength(3), Validators.required],
			],
			collegeAddres: [
				{ value: '', disabled: false },
				[Validators.minLength(5), Validators.required],
			],
			placementCoordinator: [
				{ value: '', disabled: false },
				[Validators.minLength(2), Validators.required],
			],
			placementEmail: [
				{ value: '', disabled: false },
				[Validators.required, Validators.pattern(mail)],
			],
			file: [{ value: '', disabled: false }, [Validators.required]],
			presidioMod: [
				{ value: '', disabled: false },
				[Validators.required, Validators.pattern(mail)],
			],
		});
		const now = Date.now();
		this.date = new DatePipe('en-US').transform(now, 'mediumDate');
	}
	validateDate() {
		let today = new Date();
		let t = new Date(this.driveForm.value.driveDateFrom);
		let t2 = new Date(this.driveForm.value.driveDateTo);
		let start = this.checkDifferentsOfDate(t, today);
		let end = this.checkDifferentsOfDate(t2, t);

		if (start >= 0) {
			if (end >= 0) {
				this.dateError = true;
			} else {
				this.dateError = false;
				this.toastr.warning('Sorry, End date must be start or after days');
			}
		} else {
			this.dateError = false;
			this.toastr.warning("Sorry,Don't select the past dates");
		}
	}
	checkDifferentsOfDate(start: any, end: any) {
		const diffTime = start.getTime() - end.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
		return diffDays;
	}

	ngOnInit() {
		let isViewing = sessionStorage.getItem('isViewing');
		this.driveId = sessionStorage.getItem('driveID');
		if (isViewing == '1') {
			this.spinner.show();
			this.isViewing = true;
			this.driveForm.get('file').clearValidators();
			this.driveForm.get('file').updateValueAndValidity();
			this.interviewService
				.getDriveDetailsView(parseInt(this.driveId))
				.subscribe((value: any) => {
					let data = value.Data;
          this.getRound.allDriveData = value;
					if (value.statusCode == 200) {
						this.interviewService.setDrivename(data.interview_name);
						this.driveForm.get('driveName').setValue(data.interview_name);
						this.driveForm
							.get('driveDateFrom')
							.setValue(this.datepipe.transform(data.start_date, 'yyyy-MM-dd'));
						this.driveForm
							.get('driveDateTo')
							.setValue(
								this.datepipe.transform(new Date(data.end_date), 'yyyy-MM-dd')
							);
						this.driveForm.get('collegeName').setValue(data.college_name);
						this.driveForm.get('collegeAddres').setValue(data.college_address);
						this.driveForm
							.get('placementCoordinator')
							.setValue(data.college_spoc_name);
						this.driveForm
							.get('placementEmail')
							.setValue(data.college_spoc_email);
						this.driveForm.get('presidioMod').setValue(data.moderator);
						this.spinner.hide();
					} else {
						this.toastr.warning('Something went wrong!', 'Please Try Again');
						this.spinner.hide();
					}
				});
		} else {
			this.isViewing = false;
		}
	}

	get f() {
		return this.driveForm.controls;
	}
	submit() {
		this.spinner.show();
		this.interviewService.fileDataApiCall(this.file).subscribe((value: any) => {
			if (value.statusCode == 200) {
				this.interviewService
					.inputDataApiCall(this.driveForm.value)
					.subscribe((value: any) => {
						if (value.statusCode == 200) {
							console.log(value);
							this.interviewService.setInterviewID(value.Data.interview_id);
							this.spinner.hide();
							this.route.navigate(['pages/validate-csv']);
						} else {
							this.spinner.hide();
							this.toastr.warning('Something went wrong!', 'Please Try Again');
						}
					});
			} else {
				this.spinner.hide();
				this.toastr.warning('Failed To Upload File');
			}
		});
	}
	showError(msg: any) {
		this.errorMessage = msg;
		this.excelError = true;
	}
	async onFileChange(ev: any) {
		let workBook: any;
		this.excelError = false;
		let jsonData = null;
		let finalData: any;
		const reader = new FileReader();
		const file = ev.target.files[0];
		this.filename = ev.target.files[0].name;
		reader.onload = async (event) => {
			const data = reader.result;
			workBook = XLSX.read(data, { type: 'binary' });
			jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
				const sheet = workBook.Sheets[name];
				initial = XLSX.utils.sheet_to_json(sheet);
				return initial;
			}, {});
			const dataString = JSON.stringify(jsonData);
			finalData = JSON.parse(dataString);
			this.validationResult = await this.validationsService.validate(
				finalData,
				true
			);
			if (this.validationResult.length === 0) {
			} else {
				this.showError(this.validationResult);
				this.csvDatas = [];
			}
		};
		reader.readAsBinaryString(file);
		let data = await this.base64convert(file);
	}
	base64convert(fileData: any) {
		// this.interviewService.driveName = this.driveForm.value.driveName;
		const reader: FileReader = new FileReader();
		const this_ = this;
		reader.readAsDataURL(fileData);
		reader.onload = function (e: any) {
			const imgBase64Path = e.target.result;
			let data = {
				drivename: this_.driveForm.value.driveName,
				filedatas: [imgBase64Path.split(',').pop()],
				filenames: [fileData.name],
			};
			this_.file = data;
		};
	}

	updateDrive() {
		let formDatas = this.driveForm.value;
		devicePixelRatio;
		formDatas.interviewId = this.driveId;
		this.interviewService
			.updateDriveDetails(formDatas)
			.subscribe((value: any) => {
				if (value.statusCode == 200) {
					this.toastr.success('Updated Succesfully');
				} else {
					this.toastr.error('Something went wrong');
				}
			});
	}
}
