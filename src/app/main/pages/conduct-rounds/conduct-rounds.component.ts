import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConductRoundsService } from '../../services/conduct-rounds.service';

@Component({
  selector: 'app-conduct-rounds',
  templateUrl: './conduct-rounds.component.html',
  styleUrls: ['./conduct-rounds.component.scss']
})
export class ConductRoundsComponent implements OnInit {
  roundData :any;
  datas =[];
  toggleValue: any=[];
  break=[];
  roundId:any;
  interviewerId:21;

  constructor( private ConductRoundsService:ConductRoundsService, private spinner: NgxSpinnerService,) {
    this.spinner.show();
    //STATIC VALUE 
    this.ConductRoundsService.getRounds(300).subscribe((res)=>{
      if(res.statusCode==200){
        let isChecked = true;
        res.Data.rounds.forEach((value: any) => {
          this.toggleValue.push({
            roundName: value.round_name,
            roundId: value.round_id,
            isChecked: isChecked,
          });
          if(isChecked)
            this.roundId = value.round_id;

          isChecked = false;
        });
        this.getAllSlotData(this.roundId,this.interviewerId);
      } 
    });

  }

  getAllSlotData(roundId:any,interviewerId:any){
    this.spinner.show();
    let data  = {
      "roundId" : roundId,
      "interviewerId" : interviewerId,
    }
    this.ConductRoundsService.getAllData(data).subscribe((value)=>{
      let b;
      if(value.statusCode==200){
        this.roundData = value.Data.round.panels;
        this.datas =[];
        this.break =[];
        b =JSON.parse( value.Data.round.break);  
        b.forEach(ele => {
          let temp ={
            name:ele.name,
            time: this.timeConvert(ele.startTime,ele.endTime)
          }
          this.break.push(temp);
        });
        this.dataConversion();
      }
      this.spinner.hide();
    });
    
  }

  ngOnInit(): void {
  }

  dataConversion(){
    this.roundData.slots.forEach(ele=> {
      let date = new Date();
      let  date1= new Date(ele.slot_end_time);
      const diffTime = date1.getTime() - date .getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      let time = this.timeConvert(ele.slot_start_time,ele.slot_end_time)
      let data ={
        name : ele.candidate.first_name+' '+ele.candidate.last_name,
        live : diffDays===0 && diffTime>0 ,
        timeDiff: diffTime,
        dayCount: diffDays,
        status: ele.performance.final_status,
        time : time,
      }
      this.datas.push(data);
    });
  }
  timeConvert(time1:any, time2:any){
    let t1 = new Date(time1).toLocaleTimeString().slice(0,5);
    let t2 = new Date(time2).toLocaleTimeString().slice(0,5);
    let t12 = new Date(time1).toLocaleTimeString('en-US').slice(8);
    let t22 = new Date(time2).toLocaleTimeString('en-US').slice(8)
    return t1+t12+' - '+t2+t22;
  }
  getCurrentRound(roundName: any,roundId:any) {
		this.toggleValue.forEach((value: any) => {
			if (roundName === value.roundName && roundId === value.roundId) {
				value.isChecked = true;
        this.getAllSlotData(value.roundId,this.interviewerId);
			} else {
				value.isChecked = false;
			}
		});
	}

  feedback(){

  }
}
