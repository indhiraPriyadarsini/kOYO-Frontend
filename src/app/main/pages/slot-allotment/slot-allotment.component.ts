import { DropEvent } from 'ng-drag-drop';
import { Component, OnInit } from '@angular/core';
import { OrganiseRoundsService } from '../../services/organise-rounds.service';
import {
	CandidateInterface,
	PanelInterface,
	SlotInterface,
} from 'src/app/core/constants/schema';
import { Router } from '@angular/router';
import { RoundsPlannerService } from '../../services/rounds-planner.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterviewService } from '../../services/interview.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-slot-allotment',
	templateUrl: './slot-allotment.component.html',
	styleUrls: ['./slot-allotment.component.scss'],
})
export class SlotAllotmentComponent implements OnInit {
	panels: PanelInterface[] = [];
	candidates: CandidateInterface[] = [];
	selectedPanelId: number = 1;

	isNextDisabled = (panel: PanelInterface) =>
		panel.slots.every((slot) => slot.candidate);
	totalCandidates = this.candidates.length;

	constructor(
		private ds: OrganiseRoundsService,
		private router: Router,
		private rps: RoundsPlannerService,
		private spinner: NgxSpinnerService,
		private is: InterviewService,
		private toast: ToastrService
	) {}

	ngOnInit(): void {
		this.spinner.show();
		if (
			this.ds.completeRoundData[this.ds.rounds.getValue()].nextStep.panels
				.length === 0
		) {
			this.loadStep1Data();
			this.ds.loadPanelData(this.ds.rounds.getValue());
		}
		this.ds.rounds.subscribe((round) => {
			const roundData = this.ds.completeRoundData[round];
			this.panels = roundData.nextStep.panels;
			const roundIndex = this.ds.selectedRound.findIndex((el) => el === round);
			if (
				sessionStorage.getItem('isInterviewing') === '1' &&
				this.panels.some(({ slots }) => !slots.length)
			)
				this.loadSlotDataToView();
			if (this.ds.candidatesForStep3[round]) {
				this.candidates = this.ds.candidatesForStep3[round];
				this.totalCandidates =
					this.candidates.length +
					this.panels.reduce(
						(res, { slots }) => res + slots.filter((el) => el.candidate).length,
						0
					);
				this.spinner.hide();
			} else if (roundIndex === 0) this.callCandidates(round);
			else this.callSelectedCandidates(round, roundIndex);
			if (this.panels[0].interviewers.length === 0)
				this.loadLocalInterviewData();
		});
	}

	goBack() {
		this.ds.currentStep('step3', true);
		this.router.navigate(['pages', 'step2']);
	}

	pushToService(currentRound: string) {
		this.ds.candidatesForStep3[currentRound] = this.candidates;
		this.ds.completeRoundData[currentRound].nextStep.panels = this.panels.map(
			(panel) => ({
				...panel,
				slots: panel.slots.filter((slot) => slot.candidate),
			})
		);
	}

	next() {
		const currentRound = this.ds.rounds.getValue();
		const allRounds = this.ds.selectedRound;

		this.pushToService(currentRound);
		const roundIndex = allRounds.findIndex((el) => el === currentRound);

		if (roundIndex === allRounds.length - 1)
			this.router.navigate(['pages', 'review-drive']);
		else {
			this.ds.rounds.next(allRounds[roundIndex + 1]);
			this.ds.currentStep('step3');
			this.router.navigate(['pages', 'organise-rounds']);
		}
	}

	pickRandomCandidate() {
		const randIdx = Math.floor(Math.random() * this.candidates.length);
		return this.candidates.splice(randIdx, 1)[0];
	}

	getLeftOutCandidates() {
		const candidateMap = {};
		this.candidates.forEach((el) => (candidateMap[el.id] = el));
		this.panels.forEach(({ slots }) =>
			slots.forEach((slot) =>
				slot.candidate ? delete candidateMap[slot.candidate.id] : ''
			)
		);
		const leftOutCandidates = [];
		for (let id in candidateMap) leftOutCandidates.push(candidateMap[id]);
		this.candidates = leftOutCandidates;
	}

	autoAssign() {
		// this.panels.forEach((panel) => {
		//   for (let slot of panel.slots) {
		//     if (slot.candidate) continue;
		//     slot.candidate = this.pickRandomCandidate();
		//   }
		// });

		for (let slot of this.panels[this.selectedPanelId - 1].slots) {
			if (slot.candidate) continue;
			slot.candidate = this.pickRandomCandidate();
		}
	}

	saveDraft() {
		this.pushToService(this.ds.rounds.getValue());
		localStorage.setItem(
			this.is.getInterviewID(),
			JSON.stringify(this.ds.completeRoundData)
		);
	}

	loadLocalInterviewData() {
		this.panels.forEach((panel, idx) =>
			panel.interviewers.push(
				`interviewer ${idx}1`,
				`interviewer ${idx}2`,
				`interviewer ${idx}3`,
				`interviewer ${idx}4`,
				`interviewer ${idx}5`
			)
		);
	}

	loadStep1Data() {
		const round = this.ds.completeRoundData[this.ds.rounds.getValue()];
		round.step1.breaks.push(
			{
				breakName: 'morning tea',
				startTime: '10:30 AM',
				endTime: '10:45 AM',
			},
			{
				breakName: 'lunch break',
				startTime: '12:45 PM',
				endTime: '2:00 PM',
			},
			{
				breakName: 'evening tea',
				startTime: '4:00 PM',
				endTime: '4:15 PM',
			}
		);
		(round.step1.from = '9:30 AM'),
			(round.step1.to = '6:00 PM'),
			(round.step1.interviewDuration = '30'),
			(round.step1.numberOfPanels = 4);
	}

	loadLocalData(round: string = '') {
		const dbCandidates = [
			{
				department: 'IT',
				email: 'hariharan@gmal.com',
				firstName: 'Dulce',
				githubLink: 'hari.com',
				lastName: 'Abril',
				mobileNumber: 9876545621,
				registerNumber: '10011a',
			},
			{
				department: 'IT',
				email: 'suriya@gmal.com',
				firstName: 'Mara',
				githubLink: 'hari.com',
				lastName: 'Hashimoto',
				mobileNumber: 9876545675,
				registerNumber: '10011b',
			},
			{
				department: 'IT',
				email: 'Gokul@gmal.com',
				firstName: 'Philip',
				githubLink: 'hari.com',
				lastName: 'Gent',
				mobileNumber: 8765434566,
				registerNumber: '1002d4',
			},
			{
				department: 'CSE',
				email: 'SuriyaP@gmal.com',
				firstName: 'Kathleen',
				githubLink: 'hari.com',
				lastName: 'Hanner',
				mobileNumber: 6789234569,
				registerNumber: '100d25',
			},
			{
				department: 'CSE',
				email: 'hari@gmal.com',
				firstName: 'Nereida',
				githubLink: 'hari.com',
				lastName: 'Magwood',
				mobileNumber: 8765328760,
				registerNumber: '100d26',
			},
			{
				department: 'CSE',
				email: 'sarath@gmal.com',
				firstName: 'Gaston',
				githubLink: 'hari.com',
				lastName: 'Brumm',
				mobileNumber: 9865483300,
				registerNumber: '100s27',
			},
			{
				department: 'ME',
				email: 'hello@gmal.com',
				firstName: 'Etta',
				githubLink: 'hari.com',
				lastName: 'Hurn',
				mobileNumber: 8765456270,
				registerNumber: '100a28',
			},
			{
				department: 'ME',
				email: 'hari@gmail.com',
				firstName: 'Earlean',
				githubLink: 'hari.com',
				lastName: 'Melgar',
				mobileNumber: 9865483340,
				registerNumber: '100a29',
			},
			{
				department: 'ECE',
				email: 'harii@gmal.com',
				firstName: 'Vincenza',
				githubLink: 'hari.com',
				lastName: 'Weiland',
				mobileNumber: 6789678900,
				registerNumber: '10k030',
			},
		];
		if (round)
			this.is.addCandidatesData(dbCandidates).subscribe(
				(_) => {
					this.callCandidates(round);
				},
				(err) => {
					this.spinner.hide();
					this.toast.info('loading local data');
				}
			);
		else
			this.candidates = dbCandidates.map((el, idx) => ({
				id: idx,
				name: el['firstName'] + ' ' + el['lastName'],
				registerNumber: el['register_number'],
				department: el['department'],
				email: el['email'],
				mobileNumber: el['mobile_number'],
			}));
	}

	loadSlotDataToView() {
		const panelsMap = {};
		this.panels.forEach(
			(el) => (panelsMap[el.panelId] = this.is.getSlotData(el.panelId))
		);
		forkJoin(panelsMap).subscribe((val) => {
			this.panels.forEach((panel) => {
				const fetchedSlots = val[panel.panelId]['Data'] as any[];
				const slotMap = {};
				fetchedSlots.forEach(
					(slot) =>
						(slotMap[slot['slot_id']] = this.is.getCandidate(
							slot['candidate_id']
						))
				);
				forkJoin(slotMap).subscribe((slotCandidates) => {
					fetchedSlots.forEach(
						(slot) =>
							(slot['candidate'] = slotCandidates[slot['slot_id']]['Data'])
					);
					panel.slots = fetchedSlots.map((slot) => ({
						start: slot['slot_start_time'],
						end: slot['slot_end_time'],
						slotId: slot['slot_id'],
						candidate: {
							id: slot['candidate']['candidate_id'],
							name:
								slot['candidate']['first_name'] +
								' ' +
								slot['candidate']['last_name'],
							registerNumber: slot['candidate']['register_number'],
							department: slot['candidate']['department'],
							email: slot['candidate']['email'],
							mobileNumber: slot['candidate']['mobile_number'],
						},
					}));
				});
			});
			console.log(this.panels);
		});
	}

	callCandidates(round: string) {
		this.rps.getCandidates().subscribe(
			(value: any) => {
				this.candidates = (value['Data'] as any[]).map((el) => ({
					id: el['candidateId'],
					name: el['firstName'] + ' ' + el['lastName'],
					registerNumber: el['registerNumber'],
					department: el['department'],
					email: el['email'],
					mobileNumber: el['mobileNumber'],
				}));
				this.spinner.hide();
				this.totalCandidates = this.candidates.length;
				this.getLeftOutCandidates();
				this.ds.candidatesForStep3[round] = this.candidates;
			},
			(err) => {
				console.log(err);
				this.toast.error('failed to fetch candidates');
				this.loadLocalData(round);
			}
		);
	}

	callSelectedCandidates(round: string, roundIndex: number) {
		this.is
			.getSelectedCandidates(
				this.ds.completeRoundData[this.ds.selectedRound[roundIndex - 1]].roundId
			)
			.subscribe(
				({ Data }) => {
					forkJoin(
						Data.map((el) => this.is.getCandidate(el.candidate_id))
					).subscribe((val) => {
						this.spinner.hide();
						if (val.some(({ statusCode }) => statusCode !== 200))
							this.toast.info('loading local data');
						else {
							this.candidates = val.map(({ Data: el }) => ({
								id: el['candidate_id'],
								name: el['first_name'] + ' ' + el['last_name'],
								registerNumber: el['register_number'],
								department: el['department'],
								email: el['email'],
								mobileNumber: el['mobile_number'],
							}));
							this.totalCandidates = this.candidates.length;
							this.getLeftOutCandidates();
							this.ds.candidatesForStep3[round] = this.candidates;
						}
					});
				},
				(err) => {
					console.error(err);
					this.toast.info('loading local data');
					this.spinner.hide();
					this.loadLocalData();
				}
			);
	}

	isDropAllowed(slot: SlotInterface) {
		return () => !slot.candidate;
	}

	putBack(slot: SlotInterface) {
		this.candidates.unshift(slot.candidate as CandidateInterface);
		slot.candidate = undefined;
	}

	drop(event: DropEvent, slot: SlotInterface) {
		if (!slot.candidate)
			slot.candidate = this.candidates.splice(event.dragData, 1)[0];
	}
}
