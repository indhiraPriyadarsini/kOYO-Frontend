import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RoundDetailsService } from '../../services/round-details.service';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss']
})
export class NewTemplateComponent implements OnInit {
  selectedRounds=[];
  roundId=""
  roundDetails=[];
  templateName="";
  finishButton=true;
  constructor(
	  private router:Router,
	  private roundDetailsService:RoundDetailsService,
	  private spinner: NgxSpinnerService,
	  private tostr:ToastrService
	) { }

  ngOnInit(): void {
	  this.spinner.show()
	  this.templateName=this.roundDetailsService.getTemplateName()
	  this.roundDetailsService.getAllRounds().subscribe((value:any)=>{
		  if(value.statusCode==="200"){
			this.roundDetails=value.Data;  
			this.spinner.hide()
		  }
		 else{
			this.spinner.hide()
			 this.tostr.error("something went wrong")
		 }
	  });
	  
  }
  	select(round: any) {
		  console.log(round)
		  console.log(this.selectedRounds)
		let valueDuplicateFinder = this.selectedRounds.findIndex(
			(find: any) => find.round_name == round.round_name
		);
		if (valueDuplicateFinder == -1) {
			this.selectedRounds.push(round);
		} else {
			this.selectedRounds.splice(valueDuplicateFinder, 1);
		}
		console.log(valueDuplicateFinder)
		if(this.templateName!=="" && this.selectedRounds.length!==0 ){
			this.finishButton=false;
		}
	}
	setName(){
		this.roundDetailsService.setTemplateName(this.templateName)
	}
  	createNewRound() {
		this.router.navigate(['pages', 'newRound']);
	}
	finishTemplate(){
		if(this.selectedRounds.length===0){
			this.tostr.warning("Rounds Cannot be Empty")
		}
		else{
		this.selectedRounds.forEach((values)=>{
			this.roundDetails.forEach((data)=>{
				if(values.round_details_id===data.round_details_id){
					this.roundId=this.roundId+String(values.round_details_id)+","
				}
			})
		})
		this.roundId=this.roundId.slice(0,-1);
		const data={
			roundIds:this.roundId,
			templateName:this.roundDetailsService.getTemplateName(),
			templateDescription:""
		}
		this.spinner.show();
		this.roundDetailsService.insertNewTemplate(data).subscribe((value)=>{
			if(value.statusCode==="200"){
				this.spinner.hide();
				this.tostr.success("Template Created");
			}
			else{
				this.spinner.hide();
				this.tostr.error("Something went Wrong");
			}
			
		});
	}
	}
	backto(){
		this.roundDetailsService.templateName=""
		this.router.navigate(["pages","rounds-planner"])
	}
}
