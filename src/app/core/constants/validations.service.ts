import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }


async validate(data: any, isRow: any){
    let mail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    let mobileNumber = new RegExp('^[6-9][0-9]{9}$');
    let index = 1;
    let err: any = [];
    let firstNameLength: any;
    let lastNameLength: any;
    let registerCheck: any;
    let emailCheck: any;
    let dummy = data;
    let finalError: any = [];
    data.forEach(function (value: any) {  
      err = [];
      registerCheck = dummy.filter((check: { registerNumber: any; }) => check.registerNumber == value.registerNumber);
      emailCheck = dummy.filter((check: { email: any; }) => check.email == value.email);
      if(value.firstName === undefined || value.firstName === ""){
        err.push(`- First name can't be empty`);
      }else {
        firstNameLength = value.firstName.split('').length;
      }
      if(value.lastName === undefined || value.lastName === ""){
        err.push(`- Last name can't be empty`);
      }else {
        lastNameLength = value.lastName.split('').length;
      }
      if(firstNameLength > 30){
          err.push(`- First name can't exceed 30 characters`);
      }else if(lastNameLength > 30){
         err.push(`- Last name can't exceed 30 characters`);
      }else if(value.email === undefined || value.email === "" || !mail.test(value.email) || emailCheck.length !== 1){
        if(!mail.test(value.email)){
          err.push(`- ${value.firstName} Email is invalid`);
        }else if(emailCheck.length !== 1){
          err.push(`- ${value.firstName} Email address must be unique`);
        }else{
          err.push(`- ${value.firstName} Email can't be empty`);
        }
      }else if(value.registerNumber === undefined || value.registerNumber === "" || registerCheck.length !== 1){
        if(registerCheck.length !== 1){
          err.push(`- ${value.firstName} Register number must be unique`);
        }else {
          err.push(`- ${value.firstName} Register number can't be empty`);
        }
      }else if(value.department === undefined || value.department === ""){
        err.push(`- ${value.firstName} Department can't be empty`);
      }else if(value.mobileNumber === undefined || value.mobileNumber === "" || !mobileNumber.test(value.mobileNumber)){
        if(!mobileNumber.test(value.mobileNumber)){
          err.push(`- ${value.firstName} mobileNumber number is invalid`);
        }else {
          err.push(`- ${value.firstName} mobileNumber number can't be empty`);
        }
      }
        if(err.length > 0){
          if(isRow){
            finalError[finalError.length] = `Row ${index}:`;
          }
          err.forEach(function(errValue: any){
            finalError.push(errValue);
          });
        }
      index++;
    }); 
    return await finalError;
  }


  async validateInterviewers(data: any, isRow: any){
    let mail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    let mobileNumber = new RegExp('^[6-9][0-9]{9}$');
    let index = 1;
    let err: any = [];
    let interviewerName: any;
    let emailCheck: any;
    let meetingURLCheck: any;
    let dummy = data;
    let finalError: any = [];

    if(data[0].interviewerName == undefined || data[0].email == undefined || data[0].meetingURL == undefined || data[0].category== undefined || data[0].mobileNumber == undefined){
      finalError.push("The file is not acceptable!");
      finalError.push("Please check our sample file.");
      finalError.push("Thank you.");
    }
    else{
    data.forEach(function (value: any) {  
        err = [];
        emailCheck = dummy.filter((check: { email: any; }) => check.email == value.email);
        meetingURLCheck = dummy.filter((check: { meetingURL: any; }) => check.meetingURL == value.meetingURL);
        if(value.interviewerName === ""){
          err.push(`- Interviewer name can't be empty`);
        }else {
          interviewerName = value.interviewerName.split('').length;
        }
        if(interviewerName > 30){
            err.push(`- Interviewer name can't exceed 30 characters`);
        }else if(value.email === "" || !mail.test(value.email) || emailCheck.length !== 1){
          if(!mail.test(value.email)){
            err.push(`- ${value.interviewerName} Email is invalid`);
          }else if(emailCheck.length !== 1){
            err.push(`- ${value.interviewerName} Email address must be unique`);
          }else{
            err.push(`- ${value.interviewerName} Email can't be empty`);
          }
        }else if(value.category === ""){
          err.push(`- ${value.interviewerName} Category can't be empty`);
        }else if(value.meetingURL === ""){
          err.push(`- ${value.interviewerName} Meeting URL can't be empty`);
        }else if(value.mobileNumber === "" || !mobileNumber.test(value.mobileNumber)){
          if(!mobileNumber.test(value.mobileNumber)){
            err.push(`- ${value.interviewerName} mobileNumber number is invalid`);
          }else {
            err.push(`- ${value.interviewerName} mobileNumber number can't be empty`);
          }
        }
          if(err.length > 0){
            if(isRow){
              finalError[finalError.length] = `Row ${index}:`;
            }
            err.forEach(function(errValue: any){
              finalError.push(errValue);
            });
          }
        index++;
    });
  } 
    return await finalError;
  }

}
