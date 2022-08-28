import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DisqualifyService } from '../../services/disqualify.service';

@Component({
  selector: 'app-disqualify',
  templateUrl: './disqualify.component.html',
  styleUrls: ['./disqualify.component.scss']
})
export class DisqualifyComponent implements OnInit {

  constructor(private disqualifyservice:DisqualifyService,private spinner:NgxSpinnerService) { }
  panelOpenState = false;
  hidetext:boolean=true;
  detailsData:any=[];
  updateData:any=[];
  rounds:any=[];
  open() {
    this.panelOpenState=!this.panelOpenState

  }

  ngOnInit(): void {

    this.spinner.show();
    this.disqualifyservice.getAll().subscribe((data:any)=>{
      this.detailsData=data.Data;
      this.rounds=this.detailsData.rounds;

    for(let i=0;i<this.detailsData.rounds.length;i++) {      
        let arr=this.detailsData.rounds[i].attributes.replaceAll("'",'"');
        let parsed=JSON.parse(arr);
        this.detailsData.rounds[i].attributes=parsed.reason;
    }
  
    this.spinner.hide();
  });
}
  update(data:any) {
    let attr='';
    this.updateData=
        {
          "roundPerformanceId": data.round_performance_id,
          "candidateId": data.candidate_id,
          "roundId": data.round_id,
          "interviewStatus": "ongoing",
          "nextRound": "",
          "attributes": "",
          "finalStatus": ""

        }
      this.disqualifyservice.updateCandidateForm(this.updateData).subscribe();
    }
  
}
