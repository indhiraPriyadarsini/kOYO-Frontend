export interface InterviewerInterface {
	id: number;
	mail: string;
}

export interface CandidateInterface {
	id: number;
	name: string;
}

export interface BreakInterface {
	name: string;
	startTime: string;
	endTime: string;
}

export interface SlotInterface {
	candidateId: number;
	slotStartTime: string;
	slotEndTime: string;
	webexLink: string;
}

export interface PanelInterface {
	panelName: string;
	interviewers: number[];
	slots: SlotInterface[];
}

export default interface RoundStore {
	[key: string]: {
		roundDetailsId: number;
		interviewId: number;
		interviewerIds: number[];
		roundName: string;
		date: string; // 2021-05-26T23:28:57.000Z,
		startTime: string; // 2021-05-26T23:28:57.000Z
		endTime: string; // 2021-05-27T23:28:57.000Z
		panelCount: number;
		duration: number;
		break: BreakInterface[];
		panels: PanelInterface[];
	};
}
