import { ChangeDetectorRef } from '@angular/core';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { OrganiseRoundsService } from 'src/app/main/services/organise-rounds.service';

@Component({
	selector: 'app-rounds-header',
	templateUrl: './rounds-header.component.html',
	styleUrls: ['./rounds-header.component.scss'],
})
export class RoundsHeaderComponent implements OnInit {
	rounds: any = [];
	step1: boolean = true;
	step2: boolean = false;
	step3: boolean = false;
	currentTab: any;
	toggleValue: any = [];
	constructor(
		private getRounds: OrganiseRoundsService,
		private router: Router,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		// this.getRounds.checkSession().then((roundDataValue) => {
		// 	if (
		// 		sessionStorage.getItem('isViewing') === '1' &&
		// 		roundDataValue !== null
		// 	) {
		// 		this.getRounds.completeRoundData = roundDataValue;
		// 		console.log(roundDataValue);
		// 		this.rounds = Object.keys(this.getRounds.completeRoundData);
		// 		this.getRounds.selectedRound = this.rounds;
		// 		this.getRounds.rounds.next(this.rounds[0]);
		// 	} else {
		// 		this.rounds = this.getRounds.getRoundsValue();
		// 	}
		if (this.getRounds.selectedRound.length) {
			this.rounds = this.getRounds.selectedRound;
			this.setDefaults();
		} else
			this.getRounds.roundsForUpcomingView.subscribe((rounds) => {
				if (rounds.length) {
					this.rounds = rounds;
					this.setDefaults();
				}
			});

		// });
	}

	setDefaults() {
		let isChecked = true;
		if (!this.getRounds.rounds.getValue())
			this.getRounds.rounds.next(this.rounds[0]);
		this.rounds.forEach((value: any) => {
			this.toggleValue.push({
				roundName: value,
				isChecked: isChecked,
			});
			isChecked = false;
		});
		this.getRounds.steps.subscribe((value: any) => {
			this.step1 = value.step1;
			this.step2 = value.step2;
			this.step3 = value.step3;
		});
		this.getRounds.rounds.subscribe((value: any) => {
			this.currentTab = value;
			this.toggleValue.forEach((value: any) => {
				if (this.currentTab === value.roundName) {
					value.isChecked = true;
				} else {
					value.isChecked = false;
				}
			});
		});
	}

	ngAfterViewInit() {
		this.cdr.detectChanges();
	}
	getCurrentRound(roundName: any) {
		this.getRounds.currentRound(roundName);
		this.toggleValue.forEach((value: any) => {
			if (roundName === value.roundName) {
				value.isChecked = true;
			} else {
				value.isChecked = false;
			}
		});
		this.router.navigate(['pages/organise-rounds']);
	}
}
