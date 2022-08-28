import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationsService } from 'src/app/core/constants/validations.service';
import { InterviewService } from '../../services/interview.service';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';
import { CANDIDATE_TABLE_HEADER, DEPARTMENT_OPTION } from 'src/app/core/constants/commonConstants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel-parcing',
  templateUrl: './excel-parcing.component.html',
  styleUrls: ['./excel-parcing.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})


export class ExcelParcingComponent implements OnInit {
  csvDatas: any = [];
  excelError = false;
  errorMessage: any;
  rowID: any;
  tableRowForm: any;
  validationResult: any;
  isUpdate = false;
  showDrawer = false;
  showFiles = false;
  filesDeatils: any;
  displayedColumns: string[] = CANDIDATE_TABLE_HEADER;
  dataSource = new MatTableDataSource();
  departmentList = DEPARTMENT_OPTION;
  driveId: any;
  isViewing = false;
  candidateid;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(
    private spinner: NgxSpinnerService,
    private interviewService: InterviewService,
    private validationsService: ValidationsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router:Router
  ) { 
    this.tableRowForm = fb.group({
      firstName: [{value: "", disabled: false},[Validators.required]],
      lastName: [{value: "", disabled: false},[Validators.required]],
      email: [{value: "", disabled: false},[Validators.required]],
      registerNumber: [{value: "", disabled: false},[Validators.required]],
      githubLink: [{value: "", disabled: false},[Validators.required]],
      department: [{value: "", disabled: false},[Validators.required]],
      mobileNumber: [{value: "", disabled: false},[Validators.required]],
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.spinner.show();
    let isViewing = sessionStorage.getItem("isViewing");
    this.driveId = sessionStorage.getItem("driveID");
    if(isViewing == '1'){
      this.isViewing = true;
        this.interviewService.getCandidatesView(parseInt(this.driveId)).subscribe((value: any)=> {
          if(value.statusCode == 200){
            this.csvDatas = value.Data
            this.dataSource = new MatTableDataSource(this.csvDatas);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.spinner.hide();
          }else {
            this.toastr.error("Something went wrong!");
            this.spinner.hide();
          }
        });
        this.interviewService.getFileDetails().subscribe((value: any)=> {
          if(value.statusCode == 200){
            this.filesDeatils = value.Data.FileNames;
          }else {
            this.toastr.error("Something went wrong!");
          }
        });
    }else{
      this.isViewing = false;
      this.interviewService.getCandidatesData().subscribe((value: any)=> {
      let res= value.Data;
       if(value.statusCode == "200"){
        this.csvDatas = res.filedata;
        this.dataSource = new MatTableDataSource(this.csvDatas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
       }
       this.spinner.hide();
      });
   }
  } 
  
  showError(msg: any){
    this.excelError = true;
    this.errorMessage = msg;
  }

  toggleDrawer(){
    this.showDrawer = !this.showDrawer;
  }
  toggleFileDrawer() {
    this.showFiles = !this.showFiles;
  }

  searchData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editRow(id: any, data: any){
    this.isUpdate = true;
    this.rowID = id;
    this.candidateid = data.candidateId;
    this.tableRowForm.get('firstName').setValue(data.firstName);
    this.tableRowForm.get('lastName').setValue(data.lastName);
    this.tableRowForm.get('email').setValue(data.email);
    this.tableRowForm.get('registerNumber').setValue(data.registerNumber);
    this.tableRowForm.get('githubLink').setValue(data.githubLink);
    this.tableRowForm.get('department').setValue(data.department);
    this.tableRowForm.get('mobileNumber').setValue(data.mobileNumber);
  }

  downloadFile(fileName: any){
    this.spinner.show();
    this.interviewService.getFile(fileName).subscribe((value: any)=> {
      if(value.statusCode == "200"){
        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(value.Data.filedata.Body.data)));
        let data = atob(base64String);
        const blob = new Blob([data], {type: "data:application/octet-stream;base64"});
        saveAs(blob, fileName);
        this.toastr.success("File Downloaded");
        this.spinner.hide();
      }else {
        this.toastr.error("Fail to download");  
        this.spinner.hide();
      }
    });
  }

  async addValue(){
    let formValues = this.tableRowForm.value;
    this.validationResult = await this.validationsService.validate([formValues],false);
    if(this.validationResult.length == 0){
      if(!this.isUpdate){
        this.csvDatas.push(formValues);
        this.dataSource = new MatTableDataSource(this.csvDatas);
        this.toastr.success("Row added successfully");
        }else {
          if(this.isViewing){
            this.spinner.show();
            formValues.candidateId = this.candidateid;
            formValues.driveId = this.driveId;
            this.interviewService.updateCandidate(formValues).subscribe((value: any)=> {
              if(value.statusCode == 200){
                this.csvDatas[this.rowID] = formValues;
                this.dataSource = new MatTableDataSource(this.csvDatas);
                this.toastr.success("Row Updated successfully");
                this.spinner.hide();
              }else {
                this.toastr.error("Something went wrong!");
                this.spinner.hide();
              }
            });
          }else {
          this.csvDatas[this.rowID] = formValues;
          this.dataSource = new MatTableDataSource(this.csvDatas);
          this.toastr.success("Row Updated successfully");
          }
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toggleDrawer();
        this.clearForm();
    }else {
      this.showError(this.validationResult);
    }
  }

  clearForm(){
    this.tableRowForm.get('firstName').setValue("");
    this.tableRowForm.get('lastName').setValue("");
    this.tableRowForm.get('email').setValue("");
    this.tableRowForm.get('registerNumber').setValue("");
    this.tableRowForm.get('githubLink').setValue("");
    this.tableRowForm.get('department').setValue("");
    this.tableRowForm.get('mobileNumber').setValue("");

    this.isUpdate = false; 
    this.excelError = false;
  }

  storeId(id: any, candidateId: any){
    this.rowID = id;
    this.candidateid = candidateId;
  }

  delete(){
    if(this.isViewing){
      this.spinner.show();
      this.interviewService.deleteCandidate(this.candidateid).subscribe((value: any)=> {
        if(value.statusCode == 200){
          this.csvDatas.splice(this.rowID, 1);
          this.dataSource = new MatTableDataSource(this.csvDatas);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.excelError = false;
          this.spinner.hide();
          this.toastr.success("Deleted Successfully")
        }else {
          this.spinner.hide();
          if(value.hint == "dependency issue"){
            this.toastr.error("Candidate already allocated", "OOPS!");
          }else{
            this.toastr.error("Failed to delete");
          }
        }
      })
    }else{
      this.csvDatas.splice(this.rowID, 1);
      this.dataSource = new MatTableDataSource(this.csvDatas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.excelError = false;
    }
  }

  async submit(){
    this.spinner.show();
    this.interviewService.addCandidatesData(this.csvDatas.map(el => ({...el,mobileNumber : Number(el["mobileNumber"])}))).subscribe((value: any)=>{
      if(value.statusCode == 200){
        this.spinner.hide();
        this.toastr.success('Candidates added');
        this.router.navigate(["pages","rounds-planner"]);
        this.spinner.hide();
      }else if(value.statusCode == 500){
        this.toastr.error("Failed to add");
        this.spinner.hide();
      }
    })
  }

  importExcelFile(event: any){
    let workBook: any;
    let jsonData = null;
    let finalData: any;
    const reader = new FileReader();
    const file = event.target.files[0];
    this.base64Converter(file);
    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      finalData = JSON.parse(dataString);
      this.validationResult = await this.validationsService.validate(finalData, true);
      if(this.validationResult.length === 0){
        finalData.forEach((data: any) => {
          this.csvDatas.push(data);
          this.dataSource = new MatTableDataSource(this.csvDatas);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
      else {
        this.excelError = true;
        this.showError(this.validationResult);
      }
      }
      reader.readAsBinaryString(file);
  }

  base64Converter(file: any){
    const this_ = this;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);reader.onload =function(e:any) {
      const csvBase64Path = e.target.result;
      let data ={
        fileData : csvBase64Path.split(",").pop(),
        fileName : file.name
      };
      this_.interviewService.setFileDatas(data);
    };
  }

}


