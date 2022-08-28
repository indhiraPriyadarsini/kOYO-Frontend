import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { API_URLS } from 'src/app/core/constants/apiUrl';
import {
    convertDateToTimeString,
    convertToDateTime,
} from 'src/app/core/helpers/timeValidator';
import RoundStore, {
    AllRoundCandidateInterface,
    CandidateInterface,
    HTTPResponse,
    PanelInterface,
    SlotInterface,
} from 'src/app/core/constants/schema';
import { InterviewService } from './interview.service';
import { InterviewerService } from './interviewer.service';
@Injectable({
    providedIn: 'root',
})
export class OrganiseRoundsService {
	interviewerMail: any = [];
	interviewerWebex: any = [];
	interviewerId: any = [];
    allInterviersList:any;
    allDriveData:any;
	step1 = true;
	step2 = false;
	step3 = false;
	selectedRound = [];
	roundsForUpcomingView = new BehaviorSubject([]);
	completeRoundData: RoundStore = {};
	candidatesForStep3: AllRoundCandidateInterface = {};
	validateStartTime: any;
	validateEndTime: any;
	templateId: any;
	panelRoundsCheck = [];
	rounds: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	steps: BehaviorSubject<object> = new BehaviorSubject<object>({
		step1: true,
		step2: false,
		step3: false,
	});
	Token: any;
	constructor(
		private http: HttpClient,
		private interviewDrive: InterviewService,
		private IS: InterviewerService
	) {}
	async checkSession(): Promise<any> {
		this.Token = sessionStorage.getItem('token');
		if (sessionStorage.getItem('isViewing') === '1') {
			let id = sessionStorage.getItem('driveId');
			return new Promise((resolve, reject) => {
				let value =this.viewDetails();
                console.log(value)
                value.Data.rounds.forEach((roundsData) => {
                    this.completeRoundData[roundsData.round_name] = {
                        step1: {
                            date: roundsData.date,
                            numberOfPanels: roundsData.panel_count,
                            breaks: JSON.parse(roundsData.break),
                            from: roundsData.start_time,
                            interviewDuration: roundsData.duration,
                            to: roundsData.end_time,
                            interviewerId: roundsData.interviewer_ids.split(','),
                            interviewers: [],
                            interviewLinks: [],
                        },
                        nextStep: {
                            panels: [],
                        },
                        roundDetailsId: roundsData.round_details_id,
                        interviewId: roundsData.interview_id,
                        attributes: roundsData.attributes,
                        roundId: roundsData.round_id,
                    };
                    console.log(this.completeRoundData);
                });
                resolve(this.completeRoundData);
            });
		} else {
			return null;
		}
	}
	// async findByInterviewerId(interviewId:any):Promise<any>{

    //  this.interviewerWebex=""
    //  let id=interviewId.split(',');
    //  console.log("sdjahh")
    //  let interviewrData=(await this.IS.getAllInterviewers().toPromise())["Data"]
    //  await this.findMailAndWebex(interviewrData,id)
    //  return id

    // }
    // async findMailAndWebex(interviewrData:any,ID:any){
    //  let id=ID;
    //  console.log(interviewrData,ID);
    //  this.interviewerMail=[]
    //  id.forEach((iId)=>{
    //      interviewrData.forEach((val)=>{
    //          if(val.employee_id==iId){
    //              this.interviewerMail.push(val.email)
    //              this.interviewerWebex=val.webex_link
    //          }
    //      })
    //  });
    //  console.log(this.interviewerMail,this.interviewerWebex)
    // }
    setRoundsValue(round: any, roundsId: any, roundAttributes: any) {
        this.rounds.next(round[0]);
        this.selectedRound = round;
        this.selectedRound.forEach((values, index) => {
            console.log(roundAttributes[index]);
            this.completeRoundData[values] = {
                step1: {
                    date: '',
                    numberOfPanels: 0,
                    breaks: [],
                    from: '',
                    interviewDuration: '',
                    to: '',
                    interviewers: [],
                    interviewerId: [],
                    interviewLinks: [],
                },
                nextStep: {
                    panels: [],
                },
                roundDetailsId: roundsId[index],
                interviewId: this.interviewDrive.getInterviewID(),
                attributes: roundAttributes[index],
            };
        });
    }
    getRoundsValue(): any {
        return this.selectedRound;
    }
    currentStep(steps: any, back: boolean = false) {
        if (steps === 'step1') {
            this.steps.next({ step1: false, step2: true, step3: false });
        } else if (steps === 'step2') {
            if (back) this.steps.next({ step1: true, step2: false, step3: false });
            else this.steps.next({ step1: false, step2: false, step3: true });
        } else {
            if (back) this.steps.next({ step1: false, step2: true, step3: false });
            else this.steps.next({ step1: true, step2: false, step3: false });
        }
    }

    currentRound(rounds: any) {
        this.steps.next({ step1: true, step2: false, step3: false });
        this.rounds.next(rounds);
    }

    getInterviewers() {
        const headers = {
            Authorization: this.Token,
        };
        return this.http.get(
            environment.api + API_URLS.INTERVIEWER + API_URLS.GETALL,
            {
                headers,
            }
        );
    }

    saveDraftStep1(roundDetails: any): any {
        this.completeRoundData[roundDetails.rounds].step1 = roundDetails.data;
        return this.completeRoundData;
    }

    storeStepsData(stepsData: any) {
        this.completeRoundData[stepsData.rounds].step1 = stepsData.data;
    }
    private loadSlotData(currentRound: string): SlotInterface[] {
        const round = this.completeRoundData[currentRound];
        const slotDuration = Number(round.step1.interviewDuration);
        let time: Date = convertToDateTime(round.step1.from);
        const slots: SlotInterface[] = [];
        const addMinutes = (date: Date, minutes: number): Date =>
            new Date(date.getTime() + minutes * 60000);
        while (
            addMinutes(time, slotDuration).getTime() <=
            convertToDateTime(round.step1.to).getTime()
        ) {
            const breakCheck = round.step1.breaks.find(
                ({ startTime }) =>
                    convertToDateTime(startTime).getTime() === time.getTime()
            );
            if (breakCheck) {
                time = convertToDateTime(breakCheck.endTime);
                continue;
            }
            slots.push({
                start: convertDateToTimeString(time),
                end: convertDateToTimeString(addMinutes(time, slotDuration)),
            });
            time = addMinutes(time, slotDuration);
        }
        return slots;
    }

    loadPanelData(currentRound: string) {
        const round = this.completeRoundData[currentRound];
        const numberOfPanels = round.step1.numberOfPanels;
        if (round.nextStep.panels.length) return;
        const panels = round.nextStep.panels;
        for (let i = 0; i < numberOfPanels; i++) {
            panels.push({
                interviewers: [],
                slots: this.loadSlotData(currentRound),
            });
        }
    }

    viewDetails() {
        // const headers = { Authorization: this.Token };

        // return this.http.get(
        //     'https://jthmzl8g9e.execute-api.us-east-1.amazonaws.com/Stage/interview/get?id=300',
        //     { headers }
        // );
        return this.allDriveData;
    }
}
