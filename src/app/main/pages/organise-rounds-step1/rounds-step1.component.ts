import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { OrganiseRoundsService } from '../../services/organise-rounds.service';
import { STEP1_DEFAULT_VALUES as VARIABLES } from '../../../core/constants/commonConstants';
import { BreakPlannerComponent } from '../../shared/dialog/break-planner/break-planner.component';
import { MatDialog } from '@angular/material/dialog';
import {
	timeValidator,
	convertToTimeStamp,
	convertToDateTime,
	checkStartTime,
} from '../../../core/helpers/timeValidator';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterviewService } from '../../services/interview.service';
import { InterviewerService } from '../../services/interviewer.service';

@Component({
	selector: 'app-rounds-step1',
	templateUrl: './rounds-step1.component.html',
	styleUrls: ['./rounds-step1.component.scss'],
})
export class RoundsStep1Component implements OnInit {
	timings = VARIABLES.TIMINGS;
	noOfPanels = VARIABLES.PANEL;
	viewing: boolean = false;
	//
	filteredOptions!: Observable<any>;
	validMail: any = [];
	breakFormData = [];
	rounds: string[] = [];
	step1FormValue: any = [];
	interviewersForm: any = [];
	panel: any = [];
	mail: any = [];
	displayData: any = [];
	categories: any = [];
	interviewerIdArr: any = [];
	displayInterviewers: any = [];
	//
	separatorKeysCodes = [188] as const;
	currentTab: string = '';
	employeeId: string = '';
	startDate: string = '';
	endDate: string = '';
	searchByName: any = '';
	interviewersLink: any = [];
	//
	step1 = true;
	step2 = false;
	step3 = false;
	invalidMail = false;
	repeatedMail = false;
	nextStepBtn = false;
	breakButton = false;
	dateError = false;
	//
	interviewerData = [];
	constructor(
		private fb: FormBuilder,
		private getRounds: OrganiseRoundsService,
		public dialog: MatDialog,
		private toaster: ToastrService,
		private router: Router,
		private spinner: NgxSpinnerService,
		private interviewerService: InterviewerService,
		private interviewService: InterviewService
	) {
		let mail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
		this.step1FormValue = FormGroup;
		this.interviewersForm = FormGroup;
		this.step1FormValue = fb.group(
			{
				date: [{ value: '', disabled: false }, [Validators.required]],
				panel: [{ value: '', disabled: false }, [Validators.required]],
				startTime: [{ value: '', disabled: false }, [Validators.required]],
				endTime: [{ value: '', disabled: false }, [Validators.required]],
				interviewDuration: [
					{ value: '', disabled: false },
					[Validators.required],
				],
				searchByInput: [{ value: '', disabled: false }],
			},
			{ validators: [timeValidator] }
		);
		this.interviewersForm = fb.group({
			interviewerName: [{ value: '', disabled: false }, [Validators.required]],
			interviewerMail: [
				{ value: '', disabled: false },
				[Validators.required, Validators.pattern(mail)],
			],
			interviewerCategory: [
				{ value: '', disabled: false },
				[Validators.required],
			],
			interviewerWebex: [{ value: '', disabled: false }, [Validators.required]],
			interviewerSlackMail: [
				{ value: '', disabled: false },
				[Validators.required, Validators.pattern(mail)],
			],
			interviewerMobile: [
				{ value: '', disabled: false },
				[
					Validators.required,
					Validators.maxLength(10),
					Validators.minLength(10),
				],
			],
		});
	}
	ngOnInit(): void {
		this.spinner.show();
		this.startDate = this.interviewService.fromDate;
		this.endDate = this.interviewService.toDate;
		if (sessionStorage.getItem('isViewing') === '1') this.viewing = true;
		this.checkPanelEmail();
		this.getRounds.checkSession().then((roundDataValue) => {
			if (roundDataValue !== null) {
				this.getRounds.completeRoundData = roundDataValue;
				const rounds = Object.keys(this.getRounds.completeRoundData);
				this.getRounds.selectedRound = rounds;
				this.getRounds.roundsForUpcomingView.next(rounds);
			}

			for (let i = 1; i <= this.noOfPanels; i++) {
				this.panel.push(i);
			}
			this.rounds = this.getRounds.selectedRound;
			this.getRounds.steps.subscribe((value: any) => {
				this.step1 = value.step1;
				this.step2 = value.step2;
				this.step3 = value.step3;
			});
			let rounds = [];
			let roundId = [];
			let roundAttributes = [];
			let interviewId = this.interviewService.getInterviewID();

			if (localStorage.getItem(interviewId)) {
				let data = JSON.parse(localStorage.getItem(interviewId));
				rounds = Object.keys(data);
				roundId = [];
				roundAttributes = [];
				rounds.forEach((values) => {
					roundId.push(data[values].roundDetailsId);
					roundAttributes.push(data[values].attributes);
				});
				this.getRounds.setRoundsValue(rounds, roundId, roundAttributes);
				this.getRounds.completeRoundData = data;
			}

			this.interviewerService.getAllInterviewers().subscribe((values: any) => {
				let value = values;
				if (value.statusCode == 200) {
					// this.displayData = value.Data;
					this.interviewerData = value.Data;
					this.getRounds.allInterviersList = value.Data;
					this.roundChanges();
					this.spinner.hide();
				} else {
					this.spinner.hide();
					this.router.navigate(['pages']);
				}
			});
		});
	}
	async roundChanges() {
		let savedValues: any;
		this.getRounds.rounds.subscribe((value: any) => {
			this.currentTab = value;

			if (!this.getRounds.completeRoundData[this.currentTab]) {
				this.router.navigate(['pages/rounds-planner']);
				return;
			}
			savedValues = this.getRounds.completeRoundData[this.currentTab].step1;

			if (savedValues.date !== 'Invalid dateZ') {
				this.step1FormValue
					.get('date')
					.setValue(savedValues.date.split('T')[0]);
			} else {
				this.step1FormValue.get('date').setValue('');
			}
			if (savedValues.numberOfPanels !== 0) {
				this.step1FormValue.get('panel').setValue(savedValues.numberOfPanels);
			} else {
				this.step1FormValue.get('panel').setValue('');
			}
			if (savedValues.interviewDuration !== '') {
				this.step1FormValue
					.get('interviewDuration')
					.setValue(savedValues.interviewDuration);
			} else {
				this.step1FormValue.get('interviewDuration').setValue('');
			}
			if (savedValues.date !== 'Invalid dateZ') {
				this.step1FormValue
					.get('startTime')
					.setValue(savedValues.from.substr(11, 5));
			} else {
				this.step1FormValue.get('startTime').setValue('');
			}
			if (savedValues.date !== 'Invalid dateZ') {
				this.step1FormValue
					.get('endTime')
					.setValue(savedValues.to.substr(11, 5));
			} else {
				this.step1FormValue.get('endTime').setValue('');
			}
			this.validMail = savedValues.interviewers;
			this.breakFormData =
				savedValues.breaks === '[]' ? [] : savedValues.breaks;
			this.interviewerData.forEach((values: any) => {
				if (!this.categories.includes(values.category)) {
					this.categories.push(values.category);
				}
			});
			this.displayData = this.interviewerData;
			if (this.viewing == true) {
				let interviewersId = savedValues.interviewerId;
				this.validMail = [];
				interviewersId.forEach((values) => {
					this.interviewerData.forEach((data) => {
						if (data.employee_id == values) {
							this.validMail.push(data.email);
						}
					});
				});
			}
		});
		// debugger
		return this.interviewerIdArr;
	}

	checkPanelEmail() {
		if (this.step1FormValue.value.panel <= this.validMail.length) {
			this.nextStepBtn = true;
		} else {
			this.nextStepBtn = false;
		}
	}
	removeMail(interviewerMail: { name: String }): void {
		const index = this.validMail.indexOf(interviewerMail);
		if (index >= 0) {
			this.validMail.splice(index, 1);
		}
		this.checkPanelEmail();
	}
	selectInterviewers(data: any) {
		let duplicateFinder = this.validMail.findIndex(
			(find: any) => find === data.email
		);
		if (duplicateFinder === -1) {
			this.validMail.push(data.email);
		} else {
			this.validMail.splice(duplicateFinder, 1);
		}
		this.checkPanelEmail();
	}

	saveFormDetails() {
		const formData = {
			rounds: this.currentTab,
			steps: this.findCurrentStep(),
			data: {
				interviewerId: this.getEmployeeId(),
				interviewers: this.validMail,
				date: convertToTimeStamp(this.step1FormValue.value.date),
				interviewDuration: this.step1FormValue.value.interviewDuration,
				from: convertToTimeStamp(
					convertToDateTime(this.step1FormValue.value.startTime)
				),
				to: convertToTimeStamp(
					convertToDateTime(this.step1FormValue.value.endTime)
				),
				numberOfPanels: this.step1FormValue.value.panel,
				breaks: this.breakFormData,
			},
		};
		let draftValues = this.getRounds.saveDraftStep1(formData);
		let interviewId = this.interviewService.getInterviewID();
		localStorage.setItem(interviewId, JSON.stringify(draftValues));
	}
	openBrakePlanner() {
		const dialogRef = this.dialog.open(BreakPlannerComponent, {
			width: '350px',
			height: '350px',
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const breakData = {
					breakName: result.value.breakType,
					startTime: convertToTimeStamp(
						convertToDateTime(result.value.startTime)
					),
					endTime: convertToTimeStamp(convertToDateTime(result.value.endTime)),
				};
				if (
					checkStartTime(
						this.getRounds.validateStartTime,
						breakData.startTime.substr(11, 5),
						this.step1FormValue.value.interviewDuration
					)
				) {
					this.breakFormData.push(breakData);
					this.getRounds.validateStartTime = breakData.endTime.substr(11, 5);
				} else {
					this.toaster.warning('Break During Interview Hours', '');
				}
			}
		});
	}
	getEmployeeId() {
		this.interviewerData.forEach((values: any) => {
			this.validMail.forEach((element) => {
				if (element === values.email) {
					this.interviewerIdArr.push(values.employee_id);
					this.employeeId = this.employeeId + ',' + values.employee_id;
					this.interviewersLink.push(values.webex_link);
					console.log(values.webex_link);
				}
			});
		});
		return this.interviewerIdArr;
	}
	nextStep(steps: any) {
		localStorage.removeItem('step-2');
		const formData = {
			rounds: this.currentTab,
			steps: this.findCurrentStep(),
			data: {
				interviewerId: this.getEmployeeId(),
				interviewers: this.validMail,
				date: convertToTimeStamp(this.step1FormValue.value.date),
				interviewDuration: this.step1FormValue.value.interviewDuration,
				from: convertToTimeStamp(
					convertToDateTime(this.step1FormValue.value.startTime)
				),
				to: convertToTimeStamp(
					convertToDateTime(this.step1FormValue.value.endTime)
				),
				numberOfPanels: this.step1FormValue.value.panel,
				breaks: this.breakFormData,
				interviewLinks: this.interviewersLink,
			},
		};
		this.getRounds.storeStepsData(formData);
		// console.log(formData)
		this.getRounds.currentStep(steps);
		if (sessionStorage.getItem('isViewing') !== '1')
			this.getRounds.loadPanelData(this.currentTab);
		this.router.navigate(['pages/step2']);
	}

	goBack() {
		if (this.viewing === true) {
			sessionStorage.removeItem('isViewing');
			this.router.navigate(['pages']);
		}

		const allRounds = this.getRounds.selectedRound;
		const currentRoundIndex = allRounds.findIndex(
			(el) => el === this.currentTab
		);

		if (!currentRoundIndex) this.router.navigate(['pages', 'rounds-planner']);
		else {
			this.getRounds.rounds.next(allRounds[currentRoundIndex - 1]);
			if (currentRoundIndex === 1) {
				this.getRounds.currentStep('step2');
				this.router.navigate(['pages', 'step3']);
			} else {
				this.getRounds.currentRound('step1');
				this.router.navigate(['pages', 'step2']);
			}
		}
	}
	submitInterviewer() {
		this.spinner.show();
		let data = {
			interviewerName: this.interviewersForm.controls.interviewerName.value,
			email: this.interviewersForm.controls.interviewerMail.value,
			mobileNumber: this.interviewersForm.controls.interviewerMobile.value,
			meetingURL: this.interviewersForm.controls.interviewerWebex.value,
			slackId: this.interviewersForm.controls.interviewerSlackMail.value,
			role: 'user',
			status: '',
			category: this.interviewersForm.controls.interviewerCategory.value,
		};
		this.interviewersForm.reset();
		this.interviewerService.addSingleInterviewers(data).subscribe((value) => {
			if (value.statusCode === '200') {
				this.interviewerService.getAllInterviewers().subscribe((value: any) => {
					this.interviewerData = value.Data;
					this.displayData = value.Data;
				});
				this.spinner.hide();
				this.toaster.success('Interviewer Added');
			} else {
				this.spinner.hide();
				this.toaster.error('Something Went Wrong!');
			}
		});
	}
	dateValidate() {
		let selectedDate = new Date(this.step1FormValue.value.date);
		let startDate = new Date(this.startDate);
		let endDate = new Date(this.endDate);
		if (
			(selectedDate > startDate && selectedDate < endDate) ||
			selectedDate.getDate() == startDate.getDate() ||
			selectedDate.getDate() == endDate.getDate()
		) {
			this.dateError = false;
		} else {
			this.dateError = true;
			this.toaster.warning('Invalid Drive Date');
		}
	}
	findCurrentStep(): string {
		if (this.step1 === true) {
			return 'step1';
		} else if (this.step2 === true) {
			return 'step2';
		} else {
			return 'step3';
		}
	}
	checkTime() {
		this.getRounds.validateStartTime = this.step1FormValue.value.startTime;
		this.getRounds.validateEndTime = this.step1FormValue.value.endTime;
		this.breakFormData = [];
		if (
			this.step1FormValue.value.interviewDuration !== '' &&
			this.step1FormValue.value.startTime !== '' &&
			this.step1FormValue.value.endTime !== ''
		) {
			this.breakButton = true;
			this.getRounds.validateStartTime = this.step1FormValue.value.startTime;
		}
	}
	searchByInput() {
		this.displayData = [];
		console.log(this.interviewerData);
		console.log();
		console.log(this.searchByName);
		if (this.step1FormValue.controls.searchByInput.value === '') {
			this.interviewerData.forEach((values) => {
				if (
					values.email.startsWith(
						this.step1FormValue.controls.searchByInput.value
					)
				) {
					this.displayData.push(values);
				}
			});
		} else {
			this.interviewerData.forEach((values) => {
				if (
					values.email.startsWith(
						this.step1FormValue.controls.searchByInput.value
					) &&
					this.step1FormValue.controls.searchByCategory.value ===
						values.category
				) {
					this.displayData.push(values);
				}
			});
		}
	}
	searchByCategory(categoryValue: any) {
		this.displayData = [];
		this.interviewerData.forEach((values) => {
			if (categoryValue === values.category) {
				this.displayData.push(values);
			}
		});
	}
}
