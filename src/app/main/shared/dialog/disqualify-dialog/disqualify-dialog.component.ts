import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DisqualifyService } from 'src/app/main/services/disqualify.service';
import { BreakPlannerComponent } from '../break-planner/break-planner.component';

@Component({
  selector: 'app-disqualify-dialog',
  templateUrl: './disqualify-dialog.component.html',
  styleUrls: ['./disqualify-dialog.component.scss']
})
export class DisqualifyDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DisqualifyDialogComponent>,private disqualifyservice:DisqualifyService,private spinner: NgxSpinnerService) { }
  CandidateDetails:any;
  update:any=[];
  round_id:any;
  round_performance_id:any;
  ngOnInit(): void {
  this.spinner.show();
    this.disqualifyservice.getcandidateform().subscribe((data:any)=> {
      this.CandidateDetails=data.Data;

  this.spinner.hide();
  })
}
updateData(data:any) {
  for(let i=0;i<this.CandidateDetails.candidateRoundPerformanceDetails.length;i++) {
    this.round_id=this.CandidateDetails.candidateRoundPerformanceDetails[i].round.round_id;
    this.round_performance_id=this.CandidateDetails.candidateRoundPerformanceDetails[i].round_performance_id;
  }
  let attr={
    reason:data
  }
  this.update=
      {
        "roundPerformanceId": this.round_performance_id,
        "candidateId": this.CandidateDetails.candidateDetails.candidate_id,
        "roundId": this.round_id,
        "interviewStatus": "",
        "nextRound": "no",
        "attributes": JSON.stringify(attr),
        "finalStatus": "disqualified"
      }
    this.disqualifyservice.updateCandidateForm(this.update).subscribe();
    this.dialogRef.close();
}
  closeDialog(): void {
    this.dialogRef.close();
  }

}
