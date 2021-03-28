import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../services/HttpClientService';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-conflictcolumnpermissions',
  templateUrl: './conflictcolumnpermissions.component.html',
  styleUrls: ['./conflictcolumnpermissions.component.css']
})
export class ConflictcolumnpermissionsComponent implements OnInit {
	public task_id: string;
	public taskData: any;
	public total_rows:number=0;
	public total_columns_array:any = [];
	public taskStepData:any;
	public conflictPermissionForm: FormGroup;
	constructor(private route: ActivatedRoute, public httpClientService: HttpClientService, public fb: FormBuilder) {
		this.task_id = route.snapshot.params.task_id;
		this.conflictPermissionForm = fb.group({
			permission_type: ["most"],
	    });
	}

	get f() { return this.conflictPermissionForm.controls; }

	ngOnInit(): void {
		let self = this;
		setTimeout(function () {
			self.getTasks(function() {
				self.fetchTaskStep();
			});
		}, 500);
	}

	getTasks(cb=null) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.get("tasks/view/" + this.task_id + "?page=1&perPage=11").subscribe(function (taskRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskRes.error) {
				self.taskData = taskRes.data;
				self.total_rows = self.taskData.task_details.count;
				self.total_columns_array = Array(self.taskData.task.total_columns).fill(0).map((x,i)=>i);
			}
			else {
				self.httpClientService.showError(taskRes.message);
			}
			if(cb) cb();
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	fetchTaskStep() {
		var self = this;
		this.httpClientService.showLoader = true;
		var requestData = {
			task_id: this.task_id,
			type: "conflict_permission"
		}
		this.httpClientService.post("tasks/fetchtaskstep", requestData).subscribe(function (taskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!taskStepRes.error) {
				self.taskStepData = taskStepRes.data;
				self.conflictPermissionForm.patchValue({
					permission_type: self.taskStepData.data.permission_type
				})
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}

	saveConflictPermission() {
		// console.log(this.conflictPermissionForm.value);
		var taskStepRequestData = {
			task_id: this.task_id,
			type: "conflict_permission",
			data: this.conflictPermissionForm.value,
			step_complete: true
		};
		this.saveTaskStep(taskStepRequestData);
		
	}

	saveTaskStep(taskStepRequestData) {
		var self = this;
		this.httpClientService.showLoader = true;
		this.httpClientService.post("tasks/createtaskstep", taskStepRequestData).subscribe(function (saveTaskStepRes: any) {
			self.httpClientService.showLoader = false;
			if (!saveTaskStepRes.error) {
				// var goTo = "tasks/allocateteam/"+self.task_id;
				// if (saveTaskStepRes.data.isDataTypeMissmatch) {
				// 	var goTo = "tasks/missmatchdatatype/"+self.task_id;
				// }
				self.httpClientService.goTo("tasks/reallocatetasks/"+self.task_id);
			}
			else {
				self.httpClientService.showError(saveTaskStepRes.message);
			}
		}
		, error => {
			self.httpClientService.showLoader = false;
			self.httpClientService.showError(self.httpClientService.errorMessage);
		});
	}
}
