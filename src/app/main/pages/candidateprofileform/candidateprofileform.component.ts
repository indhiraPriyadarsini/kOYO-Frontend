import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DisqualifyService } from '../../services/disqualify.service';
import { DisqualifyDialogComponent } from '../../shared/dialog/disqualify-dialog/disqualify-dialog.component';

@Component({
  selector: 'app-candidateprofileform',
  templateUrl: './candidateprofileform.component.html',
  styleUrls: ['./candidateprofileform.component.scss']
})
export class CandidateProfileFormComponent implements OnInit {

  panelOpenState:any=true;
  open:boolean=false;
  disabled:boolean=false;
  candidateData:any=[];
  updateData:any=[];
  currentDate:number=new Date().getTime();
  disable:boolean=false;
  status:any;
  str: string;
  ytr:string;
  Status: any = [
    {viewValue: 'selected'},
    { viewValue: 'onhold'},
    { viewValue: 'rejected'}
  ];
  Rounds:any=[
    {
      "RoundNumber":"Round1",
      "RoundName":"Multiple Choice Questions",
      "Status":"Qualified",
    },
    {
      "RoundNumber":"Round2",
      "RoundName":"Face to Face",
      "Status":"ongoing",
      "slot":"slot1"
    },
    {
      "RoundNumber":"Round3",
      "RoundName":"Coding Assessment",
      "Status":"Not-Commenced",
    }
  ]

  selectedStatus = this.Status[0].viewValue;
  interviewers:any=["Interviewer1@presidio.com","Interviewer2@presidio.com"]

  constructor(private fb: FormBuilder,public dialog:MatDialog,private disqualifyservice:DisqualifyService,private spinner: NgxSpinnerService,private router: Router) { 
    this.disabled=false;
  }

  


  ngOnInit(): void {

    this.spinner.show();
    this.disqualifyservice.getcandidateform().subscribe((data:any)=> {
      this.candidateData=data.Data;
      this.candidateData.candidateRoundPerformanceDetails=this.candidateData.candidateRoundPerformanceDetails.map(el => ({...el,isLive : false}));
      for(let i=0;i<this.candidateData.candidateRoundPerformanceDetails.length;i++){
        let s_time=new Date(this.candidateData.candidateRoundPerformanceDetails[i].round.start_time);
        let e_time=new Date(this.candidateData.candidateRoundPerformanceDetails[i].round.end_time);
      if(((s_time.getTime()<this.currentDate)&&(e_time.getTime()>this.currentDate))&&(this.candidateData.candidateRoundPerformanceDetails[i].final_status=='')){
        this.disable=false;
      this.candidateData.candidateRoundPerformanceDetails[i].isLive=true;
      }
      if(e_time.getTime()>this.currentDate) {
        this.disable=true;
      }
    }

    this.spinner.hide();
    })

  }

  formValue(data:any) {
    this.status=this.selectedStatus;
  }

  navigate() {
    this.router.navigate(["pages/disqualify"]);
  }
  updateRound(data:any,frontfeedback:any,feedback:any) {
    let attributes={
      frontendFeedback:frontfeedback,
      Feedback:feedback
    };
    if(this.selectedStatus=="selected") {
      data.next_round="yes";
    }
    else if (this.selectedStatus=="rejected") {
      data.next_round="no";
    }
    else {
      data.next_round="";
    }
    this.updateData=
    {
      "roundPerformanceId": data.round_performance_id,
      "candidateId": data.candidate_id,
      "roundId": data.round_id,
      "interviewStatus": "",
      "nextRound": data.next_round,
      "attributes": JSON.stringify(attributes),
      "finalStatus": this.selectedStatus
    }
    this.disqualifyservice.updateCandidateForm(this.updateData).subscribe();
  }
  candidateForm = this.fb.group({
    Frontend: [''],
    Feedback:['']
  });

  onChange($event:any){
    let text = $event.target.options[$event.target.options.selectedIndex].text;
    }
    openDialog() {
      const dialogRef = this.dialog.open(DisqualifyDialogComponent);
      dialogRef.afterClosed().subscribe();
    }

}
