import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {
  // statusForm:any;
  // "hold","accept","reject","slot","save"
  statusList = [
    {
      round:'Round 1',
      name:'Mutliple Choice Question',
      panel:'',
      status :"qualified",
      alterStatus: ""
    },
    {
      round:'Round 2',
      name:'Face to Face',
      panel:['interviewer3@presidio.com' , 'interviewer23@presidio.com'],
      status :"qualified",
      alterStatus: ""
    },
    {
      round:'Round 3',
      name:'Coding Assessment',
      panel:['interviewer3@presidio.com'],
      status :"on-hold",
      alterStatus: "qualified"
    },
    {
      round:'Round 4',
      name:'Final Panel',
      panel:['interviewer3@presidio.com' , 'interviewer23@presidio.com'],
      status :"reject",
      alterStatus: ""
    },
    {
      round:'Round 5',
      name:'Final Panel',
      panel:['interviewer3@presidio.com' , 'interviewer23@presidio.com'],
      status :"accept",
      alterStatus: "reject"
    },
    
  ];


  constructor(private router:Router) { 


  }
  
  ngOnInit(): void {
    
  }
  dashboard(){
    // this.router.navigate([''])
  }

}
