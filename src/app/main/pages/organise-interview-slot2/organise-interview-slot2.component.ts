import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InterviewService } from '../../services/interview.service';
import { InterviewerService } from '../../services/interviewer.service';
import { OrganiseRoundsService } from '../../services/organise-rounds.service';
@Component({
	selector: 'app-organise-interview-slot2',
	templateUrl: './organise-interview-slot2.component.html',
	styleUrls: ['./organise-interview-slot2.component.scss'],
})
export class OrganiseInterviewSlot2Component implements OnInit {
	list; //will get from other component
	count: any;
	droppedItems: any = [];
	currentRound: any;
	roundData: any;
	navigation = false;
	step1 = true;
	step2 = false;
	step3 = false;
	assign = [];
	interviewers = []; //will get from other component {mail:"krish@gmail.com"},{mail:"gokul@gmail.com"}
	interviewID: any;
	isViewing = false;
	constructor(
		private getRounds: OrganiseRoundsService,
		private router: Router,
		private route: ActivatedRoute,
		private toaster: ToastrService,
		private interview: InterviewService,
		private spinner: NgxSpinnerService
	) {
		this.interviewID = this.interview.interviewID;
		// let saveDraft = JSON.parse(localStorage.getItem(this.interviewID));
		let saveDraft = this.getRounds.completeRoundData;
		this.getRounds.rounds.subscribe((value: any) => {
			this.currentRound = value;
		});
		if (
			saveDraft[this.currentRound].nextStep.panels[0] &&
			saveDraft[this.currentRound].nextStep.panels[0].interviewers.length > 0
		) {
			let counts = 0;
			saveDraft[this.currentRound].nextStep.panels.map((val, i) => {
				let temp = {
					data: [],
					panel: 'panel ' + [i + 1],
				};
				val.interviewers.forEach((ele) => {
					counts = counts + 1;
					temp.data.push({ mail: ele });
				});
				this.droppedItems.push(temp);
				this.count = counts;
			});
		} else {
			let isView = sessionStorage.getItem('isViewing');
			if (isView !== '1') {
				this.roundData =
					this.getRounds.completeRoundData[this.currentRound].step1;
				this.roundData.interviewers.forEach((data, i) => {
					this.interviewers.push({
						mail: this.roundData.interviewers[i],
						interviewLinks: this.roundData.interviewLinks[i],
						interviewerId: this.roundData.interviewerId[i],
					});
				});
				this.list = parseInt(this.roundData.numberOfPanels);
				this.createArray();
				this.count = this.roundData.interviewers.length;
			}
		}
	}
	ngOnInit(): void {
		const currentRound = this.getRounds.rounds.getValue();
		const roundData = this.getRounds.completeRoundData[currentRound];
		let interviersList = this.getRounds.allInterviersList;
		
		if (
			sessionStorage.getItem('isViewing') === '1' &&
			!roundData.nextStep.panels.length
		) {
			this.isViewing = true;
			this.interview
				.getPanelData(roundData.roundId)
				.subscribe(({ Data }) => {
					let i_count=0;
					console.log("DATA",Data)
					Data.forEach((ele,ind)=> {
						let temp = {
							data: [],
							// name: ele.panel_name,
							name: "Panel "+[ind+1],
						};
						console.log("ele",ele)
						for(let i=1;i<=3;i++ ){
							let interID = "interviewer_id"+i;
							interviersList.map(id => {
								if(ele[interID]===id.employee_id){
									i_count = i_count+1;
									temp.data.push({mail:id.email,id:id.employee_id})
								}
							});
						}
						this.droppedItems.push(temp);	
					});
					this.count = i_count;
				this.spinner.hide();
			});
			this.count = this.droppedItems.length;
		}

		this.getRounds.steps.subscribe((value: any) => {
			this.step1 = value.step1;
			this.step2 = value.step2;
			this.step3 = value.step3;
		});
		this.validationChecking();
	}

	onItemDrop(e: any, i: any) {
		let data = e.dragData;
		this.droppedItems.forEach((val: any) => {
			if ('panel ' + i == val.name) {
				this.droppedItems[i - 1].data.push(data);

				this.removeItem(e.dragData, this.interviewers);
			}
		});
	}
	deleteData(e: any, i: any,view:any) {
		if(view===false){
			let temp = {
				mail: e,
			};
			this.interviewers.push(temp);
			this.removeItem(temp, this.droppedItems[i].data);
		}
		else{
			this.toaster.warning("You can't delete the Interviewers")
		}
	}
	createArray() {
		for (let i = 1; i <= this.list; i++) {
			let newName = {
				name: 'panel ' + i,
				data: [],
			};
			this.droppedItems.push(newName);
		}
	}
	removeItem(item: any, list: Array<any>) {
		let index = list
			.map(function (e) {
				return e.mail;
			})
			.indexOf(item.mail);
		list.splice(index, 1);
		this.validationChecking();
	}
	validationChecking() {
		if (this.interviewers.length === 0) {
			this.droppedItems.forEach((val: any, i: any) => {
				if (val.data.length > 0) {
					this.assign[i] = true;
				} else this.assign[i] = false;
			});
		}
		this.pageNavigate();
	}
	pageNavigate() {
		let found = this.assign.find((element) => element === false);
		if (found === false) this.navigation = false;
		else this.navigation = true;
	}
	autoAssign() {
		let temper = [];
		this.interviewers.forEach((val, i) => {
			let flag = 0;
			this.droppedItems.forEach((element, ind) => {
				if (element.data.length === 0 && flag === 0) {
					this.droppedItems[ind].data.push(val);
					temper.push(val);
					flag++;
				}
			});
		});
		temper.forEach((ele) => {
			this.removeItem(ele, this.interviewers);
		});
		this.interviewers.forEach((val, i) => {
			let index = i % this.list;
			this.droppedItems[index].data.push(val);
			this.interviewers = [];
		});
		this.validationChecking();
	}

	updateToService() {
		const panels = this.getRounds.completeRoundData[
			this.currentRound
		].nextStep.panels.map((el, idx) => {
			el.interviewers = this.droppedItems[idx].data.map(
				(el: { mail: string }) => el.mail
			);
			el.interviewerId = this.droppedItems[idx].data.map(
				(el: { interviewerId: string }) => el.interviewerId
			);
			el.interviewLink = this.droppedItems[idx].data.map(
				(el: { interviewLinks: string }) => el.interviewLinks
			);
			console.log(el);
			return el;
		});
		this.getRounds.completeRoundData[this.currentRound].nextStep.panels =
			panels;
	}

	nextStep() {
		const allRounds = this.getRounds.selectedRound;
		const currentRoundIndex = allRounds.findIndex(
			(el) => el === this.currentRound
		);
		this.updateToService();
		if (currentRoundIndex === allRounds.length - 1 && currentRoundIndex)
			this.router.navigate(['pages', 'review-drive']);
		else {
			if (currentRoundIndex === 0) {
				this.getRounds.currentStep('step2');
				this.router.navigate(['pages/step3']);
			} else {
				this.getRounds.currentRound(allRounds[currentRoundIndex + 1]);
				this.router.navigate(['pages', 'organise-rounds']);
			}
		}
	}
	saveFormDetails() {
		this.updateToService();
		this.toaster.success('Save Draft Success');
		let data = this.getRounds.completeRoundData;
		localStorage.setItem(this.interviewID, JSON.stringify(data));
	}

	goBack() {
		// this.updateToService();
		this.getRounds.currentStep('step2', true);
		this.router.navigate(['pages', 'organise-rounds']);
	}
}
