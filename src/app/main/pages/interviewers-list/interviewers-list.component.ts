import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
	CATEGORY_OPTION,
	INTERVIEWERS_LIST_TABLE_HEADER,
} from 'src/app/core/constants/commonConstants';
import { ValidationsService } from 'src/app/core/constants/validations.service';
import * as XLSX from 'xlsx';
import { InterviewersListService } from '../../services/interviewers-list.service';

@Component({
	selector: 'app-interviewers-list',
	templateUrl: './interviewers-list.component.html',
	styleUrls: ['./interviewers-list.component.scss'],
})
export class InterviewersListComponent implements OnInit {
	interviewersData: any = [];
	displayedColumnsInterviewers = INTERVIEWERS_LIST_TABLE_HEADER;
	categoryList = CATEGORY_OPTION;
	interviewerForm: any;
	dataSource = new MatTableDataSource();
	isUpdate = false;
	showDrawer = false;
	rowID: any;
	excelError: boolean;
	errorMessage: any;
	dataCount = 0;
	updateId: any;
	interviewerId: any;

	@ViewChild(MatPaginator) paginator: MatPaginator | any;
	@ViewChild(MatSort) sort: MatSort | any;

	constructor(
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		private validationsService: ValidationsService,
		private interviewerService: InterviewersListService
	) {
		this.interviewerForm = fb.group({
			interviewerName: [{ value: '', disabled: false }, [Validators.required]],
			email: [{ value: '', disabled: false }, [Validators.required]],
			meetingURL: [{ value: '', disabled: false }, [Validators.required]],
			category: [{ value: '', disabled: false }, [Validators.required]],
			mobileNumber: [{ value: '', disabled: false }, [Validators.required]],
			slack_id: [{ value: '', disabled: false }],
			role: [{ value: 'admin', disabled: false }],
			status: [{ value: '', disabled: false }],
		});
		this.showDrawer = false;
	}

	ngOnInit(): void {
		this.loadTable();
	}

	loadTable() {
		this.spinner.show();
		this.interviewerService.getInterviewers().subscribe((value: any) => {
			if (value.statusCode == '200') {
				this.interviewersData = value.Data;
				this.dataSource = new MatTableDataSource(this.interviewersData);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.spinner.hide();
				this.dataCount = this.interviewersData.length;
			} else {
				this.toastr.error('Something went wrong');
				this.spinner.hide();
			}
		});
	}

	searchData(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	toggleDrawer(): void {
		this.showDrawer = !this.showDrawer;
	}

	clearForm() {
		this.interviewerForm.get('interviewerName').setValue('');
		this.interviewerForm.get('email').setValue('');
		this.interviewerForm.get('meetingURL').setValue('');
		this.interviewerForm.get('category').setValue('');
		this.interviewerForm.get('mobileNumber').setValue('');
		this.interviewerForm.get('slack_id').setValue('');

		this.isUpdate = false;
	}

	editRow(id: any, data: any) {
		this.toggleDrawer();
		this.isUpdate = true;
		this.rowID = id;
		this.interviewerForm.get('interviewerName').setValue(data.interviewerName);
		this.interviewerForm.get('email').setValue(data.email);
		this.interviewerForm.get('meetingURL').setValue(data.meetingURL);
		this.interviewerForm.get('category').setValue(data.category);
		this.interviewerForm.get('mobileNumber').setValue(data.mobileNumber);
		this.interviewerForm.get('slack_id').setValue(data.slack_id);
		this.updateId = data.employee_id;
	}

	async addValue() {
		this.spinner.show();
		let formValues = this.interviewerForm.value;
		let validationResult: any;
		validationResult = await this.validationsService.validateInterviewers(
			[formValues],
			false
		);
		if (validationResult.length == 0) {
			if (!this.isUpdate) {
				this.interviewerService
					.addSingleInterviewer(formValues)
					.subscribe((value: any) => {
						if (value.statusCode == 200) {
							this.interviewersData.push(formValues);
							this.dataSource = new MatTableDataSource(this.interviewersData);
							this.dataSource.paginator = this.paginator;
							this.dataSource.sort = this.sort;
							this.toastr.success('Row added successfully');
							this.spinner.hide();
						} else {
							this.toastr.error('Something went Wrong');
							this.spinner.hide();
						}
					});
			} else {
				formValues.employeeId = this.updateId;
				this.interviewerService
					.updateInterviewer(formValues)
					.subscribe((value: any) => {
						if (value.statusCode == 200) {
							this.interviewersData[this.rowID] = formValues;
							this.dataSource = new MatTableDataSource(this.interviewersData);
							this.dataSource.paginator = this.paginator;
							this.dataSource.sort = this.sort;
							this.toastr.success('Row updated successfully');
							this.spinner.hide();
						} else {
							this.toastr.error('Something went wrong');
							this.spinner.hide();
						}
					});
			}
			this.clearForm();
			this.excelError = false;
		} else {
			this.showError(validationResult);
		}
	}

	storeId(id: any, inId: any) {
		this.interviewerId = inId;
		this.rowID = id;
	}

	delete() {
		this.spinner.show();
		this.interviewerService
			.deleteInterviewer(this.interviewerId)
			.subscribe((value: any) => {
				if (value.statusCode == 200) {
					this.interviewersData.splice(this.rowID, 1);
					this.dataSource = new MatTableDataSource(this.interviewersData);
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
					this.excelError = false;
					this.toastr.success('Deleted Successfully');
					this.spinner.hide();
				} else {
					this.spinner.hide();
					if (value.hint == 'dependency issue') {
						this.toastr.error('Interviewer has active drive', 'OOPS!');
					} else {
						this.toastr.error('Failed to delete');
					}
				}
			});
	}

	showError(msg: any) {
		this.excelError = true;
		this.errorMessage = msg;
	}

	importExcelFile(event: any) {
		let workBook: any;
		let jsonData = null;
		let finalData: any;
		let validationResult: any;
		const reader = new FileReader();
		const file = event.target.files[0];
		reader.onload = async (event: any) => {
			const data = reader.result;
			workBook = XLSX.read(data, { type: 'binary' });
			jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
				const sheet = workBook.Sheets[name];
				initial = XLSX.utils.sheet_to_json(sheet);
				return initial;
			}, {});
			const dataString = JSON.stringify(jsonData);
			finalData = JSON.parse(dataString);
			validationResult = await this.validationsService.validateInterviewers(
				finalData,
				true
			);
			if (validationResult.length === 0) {
				finalData.forEach((data: any) => {
					this.interviewersData.push(data);
					this.dataSource = new MatTableDataSource(this.interviewersData);
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				});
				this.toastr.success('File Imported');
				this.toggleDrawer();
				this.excelError = false;
			} else {
				this.showError(validationResult);
			}
		};
		reader.readAsBinaryString(file);
	}

	submit() {
		let current = this.interviewersData.length;
		let apidata = this.interviewersData.splice(this.dataCount, current);
		this.interviewerService
			.addInterviewers(
				apidata.map((el) => ({
					...el,
					mobileNumber: String(el['mobileNumber']),
				}))
			)
			.subscribe((value: any) => {
				if (value.statusCode == 200) {
					this.toastr.success('Interviewer updated');
					this.loadTable();
				}
			});
	}
}
