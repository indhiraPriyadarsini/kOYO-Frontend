import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.scss']
})
export class JoinMeetingComponent implements OnInit {

  joinForm = new FormGroup({
    title: new FormControl(),
    name: new FormControl(),
    region: new FormControl(),
    ns_es: new FormControl(),
  })
  constructor(private http: HttpClient) { }
  onSubmit() {
     console.log(this.joinForm.value);
     this.http.post("https://p4csdb3a08.execute-api.us-east-1.amazonaws.com/Prod/join?title="+this.joinForm.controls.title.value+"&name="+this.joinForm.controls.name.value+"&region="+this.joinForm.controls.region.value+"&ns_es=false",
     {
       title : this.joinForm.controls.title.value,
       name : this.joinForm.controls.name.value,
       region : this.joinForm.controls.region.value,
       ns_es : false
     },
     
     
   )
   .subscribe(
         (msg)=>{
         console.log(msg+"success")
       },(error)=>{
         console.log(error)
       })
  }
  joinMeeting(data:any){
    // console.log(this.contactForm);
    
  }
  
  ngOnInit(): void {
  }

}
