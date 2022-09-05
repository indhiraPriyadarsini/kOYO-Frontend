import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/pages/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InterviewService } from './main/services/interview.service';
import { PagesComponent } from './main/pages/pages/pages.component';
import { DrivedetailsComponent } from './main/pages/drivedetails/drivedetails.component';
import { SidebarComponent } from './main/shared/sidebar/sidebar.component';
import { CoreModule } from './core/core.module';
import { OrganiseRoundsService } from './main/services/organise-rounds.service';
import { RoundsStep1Component } from './main/pages/organise-rounds-step1/rounds-step1.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { UpcomingdrivesComponent } from './main/pages/upcomingdrives/upcomingdrives.component';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './main/pages/dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ValidationsService } from './core/constants/validations.service';
import { BreakPlannerComponent } from './main/shared/dialog/break-planner/break-planner.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { ExcelParcingComponent } from './main/pages/excel-parcing/excel-parcing.component';
import { StepperComponent } from './main/shared/stepper/stepper.component';
import { ToastrModule } from 'ngx-toastr';
import { RoundsPlannerComponent } from './main/pages/roundsplanner/roundsplanner.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ReviewAndFinishComponent } from './main/pages/review-and-finish/review-and-finish.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CandidateProfileComponent } from './main/pages/candidate-profile/candidate-profile.component';
import { RoundsHeaderComponent } from './main/shared/rounds_header/rounds-header/rounds-header.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgDragDropModule } from 'ng-drag-drop';
import { OrganiseInterviewSlot2Component } from './main/pages/organise-interview-slot2/organise-interview-slot2.component';
import { NewRoundComponent } from './main/pages/new-round/new-round.component';
import { CandidateProfileFormComponent } from './main/pages/candidateprofileform/candidateprofileform.component';
import { MatSelectModule } from '@angular/material/select';
import { DisplayAMPMPipe } from './main/pages/organise-rounds-step1/display-ampm.pipe';
import { SlotAllotmentComponent } from './main/pages/slot-allotment/slot-allotment.component';
import { InterviewersListComponent } from './main/pages/interviewers-list/interviewers-list.component';
import { DatePipe } from '@angular/common';
import { NewTemplateComponent } from './main/pages/new-template/new-template.component';
import { DisqualifyComponent } from './main/pages/disqualify/disqualify.component';
import { DisqualifyDialogComponent } from './main/shared/dialog/disqualify-dialog/disqualify-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { ResumeUploadComponent } from './main/pages/resume-upload/resume-upload.component';
import { ConductRoundsComponent } from './main/pages/conduct-rounds/conduct-rounds.component';
import { PastDriveDetailsComponent } from './main/pages/past-drive-details/past-drive-details.component';
import { JoinMeetingComponent } from './chime/join-meeting/join-meeting.component';
@NgModule({
  declarations: [
    AppComponent,
    JoinMeetingComponent,
    ExcelParcingComponent,
    SidebarComponent,
    HeaderComponent,
    DrivedetailsComponent,
    PagesComponent,
    RoundsStep1Component,
    UpcomingdrivesComponent,
    LoginComponent,
    DashboardComponent,
    BreakPlannerComponent,
    StepperComponent,
    RoundsPlannerComponent,
    ReviewAndFinishComponent,
    CandidateProfileComponent,
    NewRoundComponent,
    OrganiseInterviewSlot2Component,
    CandidateProfileFormComponent,
    RoundsHeaderComponent,
    SlotAllotmentComponent,
    DisplayAMPMPipe,
    InterviewersListComponent,
    NewTemplateComponent,
    DisqualifyComponent,
    DisqualifyDialogComponent,
	ConductRoundsComponent,
	ResumeUploadComponent,
	PastDriveDetailsComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatStepperModule,
    CoreModule,
    MatDialogModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatButtonModule,
    MatSortModule,
    MatStepperModule,
    MatProgressBarModule,
    DragDropModule,
    MatSidenavModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSelectModule,
	MatMenuModule,
	MatListModule,
	MatTooltipModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      tapToDismiss: false,
      closeButton: true,
    }),
    NgDragDropModule.forRoot(),
  ],
  entryComponents: [BreakPlannerComponent],
  exports:[
    FormsModule
  ],
  providers: [InterviewService, ValidationsService, OrganiseRoundsService, DatePipe],
  bootstrap: [AppComponent],
	
})
export class AppModule {
}
