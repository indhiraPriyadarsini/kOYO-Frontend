import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinMeetingComponent } from './join-meeting/join-meeting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../app.module';



@NgModule({
  declarations: [
    JoinMeetingComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppModule,
    ReactiveFormsModule
  ]
})
export class ChimeModule { }
