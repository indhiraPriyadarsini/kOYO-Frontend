import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CognitoAuthGuard } from '@guards/cognito-auth/cognito-auth.guard';
import { LoginComponent } from './login/login/login.component';
import { CandidateProfileFormComponent } from './main/pages/candidateprofileform/candidateprofileform.component';
import { CandidateProfileComponent } from './main/pages/candidate-profile/candidate-profile.component';
import { DashboardComponent } from './main/pages/dashboard/dashboard.component';
import { DrivedetailsComponent } from './main/pages/drivedetails/drivedetails.component';
import { ExcelParcingComponent } from './main/pages/excel-parcing/excel-parcing.component';
import { NewRoundComponent } from './main/pages/new-round/new-round.component';
import { OrganiseInterviewSlot2Component } from './main/pages/organise-interview-slot2/organise-interview-slot2.component';
import { PagesComponent } from './main/pages/pages/pages.component';
import { ReviewAndFinishComponent } from './main/pages/review-and-finish/review-and-finish.component';
import { RoundsStep1Component } from './main/pages/organise-rounds-step1/rounds-step1.component';
import { RoundsPlannerComponent } from './main/pages/roundsplanner/roundsplanner.component';
import { SlotAllotmentComponent } from './main/pages/slot-allotment/slot-allotment.component';
import { InterviewersListComponent } from './main/pages/interviewers-list/interviewers-list.component';
import { DisqualifyComponent } from './main/pages/disqualify/disqualify.component';
import { NewTemplateComponent } from './main/pages/new-template/new-template.component';
import { ResumeUploadComponent } from './main/pages/resume-upload/resume-upload.component';
import { ConductRoundsComponent } from './main/pages/conduct-rounds/conduct-rounds.component';
import { PastDriveDetailsComponent } from './main/pages/past-drive-details/past-drive-details.component';
import { JoinMeetingComponent } from './chime/join-meeting/join-meeting.component';


const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'join', component: JoinMeetingComponent },
	
	
	{
		path: 'pages',
		component: PagesComponent,
		//canActivate: [CognitoAuthGuard],
		children: [
			{
				path: '',
				component: DashboardComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'interview-creation',
				component: DrivedetailsComponent,
				//  canActivate: [CognitoAuthGuard]
			},
			{
				path: 'validate-csv',
				component: ExcelParcingComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'rounds-planner',
				component: RoundsPlannerComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'review-drive',
				component: ReviewAndFinishComponent,
			},
			{
				path: 'step2',
				component: OrganiseInterviewSlot2Component,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'step3',
				component: SlotAllotmentComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'profile',
				component: CandidateProfileComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'organise-rounds',
				component: RoundsStep1Component,
				canActivate: [CognitoAuthGuard],
			},

			{
				path: 'candidate-feedback',
				component: CandidateProfileFormComponent,
				canActivate: [CognitoAuthGuard],
			},

			{
				path: 'disqualify',
				component: DisqualifyComponent,
			},
			{
				path: 'newRound',
				component: NewRoundComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'conduct-rounds',
				component: ConductRoundsComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'interviewers-list',
				component: InterviewersListComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'newTemplate',
				component: NewTemplateComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'candidate-resume/:candidateId',
				component: ResumeUploadComponent,
				canActivate: [CognitoAuthGuard],
			},
			{
				path: 'past-drives/:driveId',
				component: PastDriveDetailsComponent,
				canActivate: [CognitoAuthGuard],
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
