export interface BreakInterface {
	breakName: string;
	startTime: string;
	endTime: string;
}

export interface CandidateInterface {
	id: number;
	name: string;
	registerNumber: string;
	department: string;
	email: string;
	mobileNumber: string;
}

export interface Step1Interface {
	date: string;
	numberOfPanels: number;
	from: string;
	to: string;
	interviewDuration: string;
	breaks: BreakInterface[];
	interviewers: string[];
	interviewerId: [];
	interviewLinks: [];
}

export interface SlotInterface {
	slotId?: number;
	start: string;
	end: string;
	candidate?: CandidateInterface;
}

export interface PanelInterface {
	panelId?: number;
	interviewers: string[];
	interviewLink?: string;
	interviewerId?: string;
	slots?: SlotInterface[];
}
export interface NextStepInterface {
	panels: PanelInterface[];
}
export default interface RoundStore {
	[key: string]: {
		step1: Step1Interface;
		nextStep: NextStepInterface;
		roundDetailsId: number;
		interviewId: number;
		attributes: string;
		roundId?: number;
	};
}

export interface AllRoundCandidateInterface {
	[key: string]: CandidateInterface[];
}
export interface HTTPResponse<T> {
	Message: string;
	statusCode: number;
	Data: T;
}
