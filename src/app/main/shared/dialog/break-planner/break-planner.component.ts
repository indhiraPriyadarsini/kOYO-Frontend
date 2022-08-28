import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { timeValidator } from 'src/app/core/helpers/timeValidator';
import { OrganiseRoundsService } from 'src/app/main/services/organise-rounds.service';

@Component({
	selector: 'app-break-planner',
	templateUrl: './break-planner.component.html',
	styleUrls: ['./break-planner.component.scss'],
})
export class BreakPlannerComponent implements OnInit {
	breakPlannerForm: any;
	invalidStartTime = false;
	invalidEndTime = false;
	constructor(
		private fb: FormBuilder,
		public getRounds: OrganiseRoundsService,
		public dialogRef: MatDialogRef<BreakPlannerComponent>
	) {
		this.breakPlannerForm = FormGroup;
		this.breakPlannerForm = fb.group(
			{
				breakType: [{ value: '', disabled: false }, [Validators.required]],
				startTime: [{ value: '', disabled: false }, [Validators.required]],
				endTime: [{ value: '', disabled: false }, [Validators.required]],
			},
			{ validators: [timeValidator] }
		);
	}

	ngOnInit(): void {}
	onNoClick(): void {
		this.dialogRef.close();
	}
	startTime(time: any) {
		this.invalidStartTime = false;
		if (time > this.getRounds.validateStartTime) {
			this.invalidStartTime = false;
		} else {
			this.invalidStartTime = true;
		}
	}
	endTime(time: any) {
		this.invalidEndTime = true;
		if (time > this.getRounds.validateEndTime) {
			this.invalidEndTime = true;
		} else {
			this.invalidEndTime = false;
		}
	}
}
