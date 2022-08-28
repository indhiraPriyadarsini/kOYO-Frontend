import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PANEL_TABLE_HEADER } from 'src/app/core/constants/commonConstants';
import { PanelInterface } from 'src/app/core/constants/schema';
import { InterviewService } from '../../services/interview.service';
import { OrganiseRoundsService } from '../../services/organise-rounds.service';
import { ReviewAndFinishService } from '../../services/review-and-finish.service';

export interface driveInfo {
	college_name: string;
	college_spoc_email: string;
	start_date: any;
	end_date: any;
	interview_name: any;
	college_spoc_name: string;
}
@Component({
	selector: 'app-review-and-finish',
	templateUrl: './review-and-finish.component.html',
	styleUrls: ['./review-and-finish.component.scss'],
})
export class ReviewAndFinishComponent implements OnInit, AfterViewInit {
	driveDetails: driveInfo;
	toggelAllPanel = false;
	PaneldisplayedColumns: string[] = PANEL_TABLE_HEADER;
	dataSource: any = new MatTableDataSource<any>([]);
	slackChannel = false;
	emailAlerts = false;
	hideForPdf = true;
	toggleValue: any = [];
	pdfChange = false;
	currentRound: any;
	roundInfo: any;
	panels: any;
	completeData: any;
	finalData: any;

	isNextDisabled = (panel: PanelInterface) =>
		panel.slots.some((slot) => slot.candidate);

	@ViewChild(MatSort) sort: MatSort | any;
	constructor(
		private cdr: ChangeDetectorRef,
		private spinner: NgxSpinnerService,
		private roundsService: OrganiseRoundsService,
		private interviewService: InterviewService,
		private reviewDriveService: ReviewAndFinishService,
		private router: Router,
		private toaster: ToastrService
	) {}

	ngOnInit(): void {
		this.spinner.show();
		this.interviewService.getDriveDetails().subscribe(
			(response: any) => {
				//Next callback
				this.driveDetails = response.Data;
				this.spinner.hide();
			},
			(error) => {
				console.error('error caught in component', error);
				this.toaster.error('Failed to get drive data');
				this.spinner.hide();
			}
		);
		const beforeToggle = this.roundsService.getRoundsValue();
		let isChecked = true;
		beforeToggle.forEach((value: any) => {
			this.toggleValue.push({
				round: value,
				isChecked: isChecked,
			});
			if (isChecked) {
				this.currentRound = value;
			}
			isChecked = false;
		});
		this.completeData = this.roundsService.completeRoundData;
		this.loadPanetable(this.currentRound);
	}

	ngAfterViewInit() {
		this.cdr.detectChanges();
	}

	async loadPanetable(rounds: any) {
		let roundsDetails;
		this.roundInfo = await this.completeData[rounds].step1;
		roundsDetails = await this.completeData[rounds]?.nextStep;
		this.panels = roundsDetails?.panels;
		let i = 0;
		this.panels.forEach((value: any) => {
			this.dataSource[i] = new MatTableDataSource<any>(value.slots);
			// this.cdr.detectChanges();
			i++;
		});
		this.spinner.hide();
	}
	togglePanel() {
		this.toggelAllPanel = !this.toggelAllPanel;
	}

	changeRound(value: any) {
		this.spinner.show();
		this.currentRound = value.target.outerText;
		this.loadPanetable(this.currentRound);
	}

	async finish() {
		this.spinner.show();
		const data = {};
		let roundNames = Object.keys(this.completeData);
		let convertData = [];
		let dummy = [];
		for (let i = 0; i < roundNames.length; i++) {
			dummy[roundNames[i]] = this.completeData[roundNames[i]];
			convertData[i] = dummy;
			dummy = [];
		}
		convertData.forEach((element: any) => {
			let roundName = Object.keys(element);
			let roundsValues = element[roundName[0]];
			let pannelArray = element[roundName[0]].nextStep.panels;
			let panels = [];

			if (roundsValues.step1.breaks == undefined) {
				roundsValues.step1.breaks = [];
			}

			pannelArray.forEach((element: any, i: any) => {
				let slotsArray = element.slots;
				let slots = [];
				slotsArray.forEach((element: any) => {
					slots.push({
						candidateId: element.candidate?.id,
						slotStartTime: element.start,
						slotEndTime: element.end,
					});
				});
				panels.push({
					panelName: 'Panel' + (i + 1),
					slots: slots,
					interviewerId: element.interviewerId,
					webexLink: element.interviewLink[0],
				});
			});
			data[roundName[0]] = {
				roundDetailsId: roundsValues.roundDetailsId,
				interviewId: roundsValues.interviewId,
				interviewerIds: roundsValues.step1.interviewerId,
				roundName: roundName[0],
				date: roundsValues.step1.date,
				startTime: roundsValues.step1.from,
				endTime: roundsValues.step1.to,
				panelCount: parseInt(roundsValues.step1.numberOfPanels),
				duration: parseInt(roundsValues.step1.interviewDuration),
				break: roundsValues.step1.breaks,
				panels: panels,
				attributes: roundsValues.attributes,
			};
		});
		let rounds = this.roundsService.getRoundsValue();
		rounds.forEach((element) => {
			let finalData = {
				roundNames: rounds,
				round: {
					[element]: data[element],
				},
			};
			this.reviewDriveService.createDrive(finalData).subscribe((value: any) => {
				if (value.statusCode == 200) {
					this.toaster.success('Drive Created Successfully');
					this.router.navigate(['/pages']);
					this.spinner.hide();
				} else {
					this.toaster.error('try after some time');
					this.spinner.hide();
				}
			});
		});
	}
}
