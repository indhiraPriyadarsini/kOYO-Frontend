import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrganiseRoundsService } from '../../services/organise-rounds.service';
import { RoundDetailsService } from '../../services/round-details.service';
import { RoundsPlannerService } from '../../services/rounds-planner.service';
@Component({
    selector: 'app-roundsplanner',
    templateUrl: './roundsplanner.component.html',
    styleUrls: ['./roundsplanner.component.scss'],
})
export class RoundsPlannerComponent implements OnInit {
    createTemplate = false;
    templateName: any = [];
    storeSelectedRounds: any = [];
    templateId:any;
    roundDetails = []; 
    roundId=[];
    roundAttributes=[]
    selectedTemplate=""
    selectedRounds: String[] = [];
    templateRounds: any = [];
    constructor(
        public getTemplate: RoundsPlannerService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private getRounds: OrganiseRoundsService,
        private roundDetailsService: RoundDetailsService 
    ) {}
    ngOnInit(): void {
        let roundDetailsData=this.roundDetailsService.getRoundsDetails();
        if(roundDetailsData){
            this.roundDetails=roundDetailsData
        }
        
        this.spinner.show();
        this.selectedRounds=this.getRounds.selectedRound;
        this.templateId=this.getTemplate.getTemplateId();
        this.getTemplate.getTemplates().subscribe((value: any) => {
            let templateInfo = value.Data;
            templateInfo.forEach((value: any) => {
                this.templateName.push(value);
                if(value.template_id===+this.templateId){
                    this.selectedTemplate=value.template_name;
                }
            });
            this.spinner.hide();
        });
    }
    getTemplateRounds(id: any) {
        this.spinner.show();
        this.templateId=id.target.value;
        this.getTemplate.setTemplateId(this.templateId);
        this.getTemplate.getRounds(id.target.value).subscribe((value: any) => {
            value.Data.forEach((values) => {
                if (values === null) {
                    this.roundDetails = [];
                } else {
                    this.roundDetails.push(values);
                    this.roundDetailsService.setRoundDetails(values);
                }
            });
            this.spinner.hide();
        });
        this.selectedRounds=[]
    }
    select(round: any) {
        let valueDuplicateFinder = this.selectedRounds.findIndex(
            (find: any) => find == round
        );
        if (valueDuplicateFinder == -1) {
            this.selectedRounds.push(round);
        } else {
            this.selectedRounds.splice(valueDuplicateFinder, 1);
        }
    }
    newTemplate() {
        this.router.navigate(["pages","newTemplate"])
    }
    nextStep() {
        this.selectedRounds.forEach((roundName)=>{
            this.roundDetails.forEach((values)=>{
                if(roundName===values.round_name){
                    console.log(values)
                    this.roundId.push(values.round_details_id)
                    this.roundAttributes.push(values.attributes);
                }
            })
        });
        this.getRounds.setRoundsValue(this.selectedRounds,this.roundId,this.roundAttributes);
        this.router.navigate(['pages/organise-rounds']);
    }
    createNewRound() {
        this.getRounds.setRoundsValue(this.selectedRounds,this.roundId,this.roundAttributes);
        this.router.navigate(['pages', 'newRound']);
    }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.selectedRounds, event.previousIndex, event.currentIndex);
      }
}
