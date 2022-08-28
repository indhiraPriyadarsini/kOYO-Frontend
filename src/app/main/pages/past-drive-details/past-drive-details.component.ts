import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import html2PDF from 'jspdf-html2canvas';
import { InterviewService } from '../../services/interview.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

interface RoundInterface {
	round_id: number;
	round_name: string;
	selectedCount: number;
}

export interface PastDriveDataInterface {
	interview_name: string;
	college_name: string;
	college_spoc_name: string;
	college_spoc_email: string;
	start_date: string;
	end_date: string;
	candidate_ids: string;
	rounds: RoundInterface[];
}

@Component({
	selector: 'app-past-drive-details',
	templateUrl: './past-drive-details.component.html',
	styleUrls: ['./past-drive-details.component.scss'],
})
export class PastDriveDetailsComponent implements OnInit {
	constructor(
		private ds: DashboardService,
		private is: InterviewService,
		private route: ActivatedRoute,
		private router: Router,
		private toast: ToastrService,
		private spinner: NgxSpinnerService
	) {}

	driveData: PastDriveDataInterface;

	selectedCandidates: string[] = [];

	goBack() {
		this.router.navigateByUrl('pages');
	}

	exportAsPdf(el: HTMLDivElement) {
		html2PDF(el, {
			jsPDF: {
				format: 'a4',
			},
			imageType: 'image/png',
			output: './pdf/drive-details.pdf',
		});
	}

	ngOnInit(): void {
		this.loadLocalData();
		this.spinner.show();
		this.ds.getPastDrives(this.route.snapshot.params.driveId).subscribe(
			({
				Data: {
					interview_name,
					college_name,
					college_spoc_name,
					college_spoc_email,
					start_date,
					end_date,
					candidate_ids,
					rounds,
				},
			}) => {
				this.driveData = {
					interview_name,
					college_name,
					college_spoc_name,
					college_spoc_email,
					start_date,
					end_date,
					candidate_ids,
					rounds: rounds.map(({ round_id, round_name, selectedCount }) => ({
						round_id,
						round_name,
						selectedCount,
					})),
				};
				const lastRound =
					this.driveData.rounds[this.driveData.rounds.length - 1];
				this.is
					.getSelectedCandidates(
						lastRound.selectedCount === 0 ? 115 : lastRound.round_id
					)
					.subscribe(
						({ Data }) => {
							forkJoin(
								Data.map((el) => this.is.getCandidate(el.candidate_id))
							).subscribe((val) => {
								this.spinner.hide();
								if (val.some(({ statusCode }) => statusCode !== 200))
									this.toast.info('loading local data');
								else
									this.selectedCandidates = val.map(
										({ Data }) => Data.first_name + ' ' + Data.last_name
									);
							});
						},
						(err) => {
							console.error(err);
							this.toast.info('loading local data');
							this.spinner.hide();
						}
					);
			},
			(err) => {
				console.error(err);
				this.toast.info('loading local data');
				this.spinner.hide();
			}
		);
	}

	loadLocalData() {
		this.selectedCandidates = [
			'Raghavan Selladurai',
			'Manisha Na Chatterjee',
			'Someshwar Sekaran',
			'Manisha Na Chatterjee',
			'Karthikeyan Rajendran',
			'Meenakshi Sundarrajan',
		];
		const candidateIds: number[] = [];
		for (let i = 1; i <= 42; i++) candidateIds.push(i);
		this.driveData = {
			college_name: 'Xyzzy institute of technology,Chennai',
			start_date: '2021-05-23T00:00:00.000Z',
			end_date: '2021-05-25T00:00:00.000Z',
			interview_name: 'PSG Summer Internship',
			college_spoc_email: 'hemanthsrakar@gmail.com',
			college_spoc_name: 'Suriya Krishnan',
			candidate_ids: candidateIds.toString(),
			rounds: [
				{
					round_id: 1,
					round_name: 'Screening - MCQ',
					selectedCount: 42,
				},
				{
					round_id: 2,
					round_name: 'Face - Face Interview',
					selectedCount: 36,
				},
				{
					round_id: 3,
					round_name: 'Coding Assessment',
					selectedCount: 16,
				},
				{
					round_id: 4,
					round_name: 'HR Round',
					selectedCount: 13,
				},
				{
					round_id: 5,
					round_name: 'Final Round',
					selectedCount: 6,
				},
			],
		};
	}
}
